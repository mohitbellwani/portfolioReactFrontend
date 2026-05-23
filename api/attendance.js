export default async function handler(req, res) {
  try {
    const { action } = req.query;
    // valid actions: 'in', 'out', 'kickstart', 'reschedule_out', 'diagnose'
    if (!['in', 'out', 'kickstart', 'reschedule_out', 'diagnose'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // 1. Verify Authentication
    const authHeader = req.headers.authorization;
    if (action === 'kickstart' || action === 'reschedule_out' || action === 'diagnose') {
      if (authHeader !== 'Bearer 1234') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    let logType = 'SYSTEM';
    if (action === 'in') logType = 'IN';
    if (action === 'out') logType = 'OUT';
    if (action === 'kickstart') logType = 'START';
    if (action === 'reschedule_out') logType = 'RESCHEDULE';
    if (action === 'diagnose') logType = 'DIAG';

    // 3. The Gatekeeper (KV Check)
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    const qstashToken = process.env.QSTASH_TOKEN;
    const qstashUrl = process.env.QSTASH_URL || 'https://qstash.upstash.io';

    if (!kvUrl || !kvToken) {
      return res.status(500).json({ error: 'KV variables are not configured' });
    }

    const kvGetResponse = await fetch(`${kvUrl}/get/attendance_settings`, {
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });

    const kvData = await kvGetResponse.json();
    let settings = { skip_today: false, holidays: [], skip_weekdays: [], logs: [], base_checkin_time: "10:00" };
    if (kvData && kvData.result) {
      try {
        settings = { ...settings, ...(typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result) };
      } catch (e) {
        console.error("Error parsing KV settings", e);
      }
    }

    const addLog = async (status, message) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: logType,
        status,
        message
      };
      
      const updatedLogs = [logEntry, ...(settings.logs || [])].slice(0, 20); // Keep last 20
      settings.logs = updatedLogs;
      
      await fetch(`${kvUrl}/set/attendance_settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
    };

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const scheduleNextEvent = async (nextAction, targetTimestampMs) => {
      if (!qstashToken) {
        console.error('QSTASH_TOKEN not found, skipping scheduling');
        return;
      }
      
      if (settings.last_msg_id) {
        // Cancel the previous scheduled message to prevent duplicates
        await fetch(`${qstashUrl}/v2/messages/${settings.last_msg_id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${qstashToken}` }
        }).catch(e => console.error("Failed to cancel previous QStash message", e));
      }

      const targetUnix = Math.floor(targetTimestampMs / 1000);
      const url = `${baseUrl}/api/attendance?action=${nextAction}`;

      const pubRes = await fetch(`${qstashUrl}/v2/publish/${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qstashToken}`,
          'Upstash-Forward-Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Upstash-Not-Before': targetUnix.toString()
        }
      });
      
      const pubData = await pubRes.json().catch(() => ({}));
      
      if (!pubRes.ok) {
        const errMsg = `QStash publish FAILED (${pubRes.status}): ${JSON.stringify(pubData)}`;
        console.error(errMsg);
        await addLog('error', errMsg);
        return; // Don't update pending status on failure
      }
      
      if (pubData && pubData.messageId) {
        settings.last_msg_id = pubData.messageId;
      }

      settings.pending_action = nextAction.toUpperCase();
      settings.pending_time = new Date(targetTimestampMs).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      await addLog('info', `Scheduled next ${nextAction.toUpperCase()} at ${settings.pending_time} (msgId: ${pubData.messageId || 'unknown'})`);
    };

    // Format current date in IST
    const now = new Date();
    const formatterIST = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const getRandomOffset = () => Math.floor(Math.random() * 11) - 5; // -5 to +5 minutes
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30

    // Helper: Create a UTC timestamp for a given IST time (hours, minutes) on a given date
    const toISTTimestamp = (date, hours, minutes) => {
      // Get the IST date components for the given UTC date
      const istDate = new Date(date.getTime() + IST_OFFSET_MS);
      istDate.setUTCHours(hours, minutes, 0, 0);
      // Convert back: subtract IST offset to get actual UTC ms
      return istDate.getTime() - IST_OFFSET_MS;
    };

    // Helper: Get day-of-week in IST for a given UTC date
    const getISTDayOfWeek = (date) => {
      const istDate = new Date(date.getTime() + IST_OFFSET_MS);
      return istDate.getUTCDay();
    };

    const calculateNextCheckinMs = (baseDate) => {
      // Find the next valid day
      let nextDate = new Date(baseDate.getTime());
      nextDate.setDate(nextDate.getDate() + 1); // Start checking tomorrow
      
      while (true) {
        const parts = formatterIST.formatToParts(nextDate);
        const getP = (t) => parts.find(p => p.type === t)?.value;
        const dStr = `${getP('year')}-${getP('month')}-${getP('day')}`;
        const dow = getISTDayOfWeek(nextDate);
        
        const isH = Array.isArray(settings.holidays) && settings.holidays.includes(dStr);
        const isW = Array.isArray(settings.skip_weekdays) && settings.skip_weekdays.includes(dow);
        
        if (!isH && !isW) {
          break; // Found a valid day
        }
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const [baseH, baseM] = (settings.base_checkin_time || "10:00").split(':').map(Number);
      const targetMs = toISTTimestamp(nextDate, baseH, baseM);

      // Add random offset
      const offsetMs = getRandomOffset() * 60 * 1000;
      return targetMs + offsetMs;
    };

    if (action === 'diagnose') {
      // Safe diagnostic: tests QStash connectivity without touching Frappe
      const diagnostics = {
        qstash_token_present: !!qstashToken,
        qstash_token_length: qstashToken ? qstashToken.length : 0,
        cron_secret_present: !!process.env.CRON_SECRET,
        kv_connected: !!(kvUrl && kvToken),
        base_url: baseUrl,
        settings_base_checkin: settings.base_checkin_time,
        settings_base_checkout: settings.base_checkout_time,
        settings_last_msg_id: settings.last_msg_id,
        settings_pending_action: settings.pending_action,
        settings_pending_time: settings.pending_time,
        server_time_utc: now.toISOString(),
        server_time_ist: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
      await addLog('info', `Diagnostics run: QSTASH=${diagnostics.qstash_token_present}, CRON=${diagnostics.cron_secret_present}, URL=${baseUrl}`);
      return res.status(200).json({ diagnostics });
    }

    if (action === 'kickstart') {
      const nextMs = calculateNextCheckinMs(now); // Starts checking from tomorrow onwards
      await scheduleNextEvent('in', nextMs);
      return res.status(200).json({ message: 'QStash loop successfully kickstarted!' });
    }

    if (action === 'reschedule_out') {
      const [outH, outM] = (settings.base_checkout_time || "19:10").split(':').map(Number);
      let checkoutMs = toISTTimestamp(now, outH, outM) + getRandomOffset() * 60 * 1000;
      
      if (checkoutMs <= now.getTime()) {
        await addLog('error', `Check-Out time ${outH}:${String(outM).padStart(2,'0')} IST has already passed for today.`);
        return res.status(400).json({ error: 'This check-out time has already passed for today. Update the time and try again.' });
      }
      
      await scheduleNextEvent('out', checkoutMs);
      return res.status(200).json({ message: 'Successfully rescheduled today\'s check-out!' });
    }
    
    // en-US formats as MM/DD/YYYY, let's extract parts to be safe
    const parts = formatterIST.formatToParts(now);
    const getPart = (type) => parts.find(p => p.type === type)?.value;
    
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour') === '24' ? '00' : getPart('hour'); // Handle 24:00 edge case
    const minute = getPart('minute');
    const second = getPart('second');

    const currentDateIST = `${year}-${month}-${day}`;
    const currentTimeIST = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const isHoliday = Array.isArray(settings.holidays) && settings.holidays.includes(currentDateIST);
    const dayOfWeek = getISTDayOfWeek(now); // 0 is Sunday, 6 is Saturday
    const isSkipWeekday = Array.isArray(settings.skip_weekdays) && settings.skip_weekdays.includes(dayOfWeek);

    if (settings.skip_today || isHoliday || isSkipWeekday) {
      const reason = settings.skip_today ? "Skip Today is active" : (isHoliday ? "Holiday" : "Skipped Weekday");
      // (Self-cleanup rule)
      if (settings.skip_today) {
        settings.skip_today = false;
      }
      
      await addLog('skipped', reason);
      
      // CRITICAL FIX: Keep the QStash loop alive even if we skip!
      if (action === 'in' || action === 'out') {
        const nextCheckinMs = calculateNextCheckinMs(now);
        await scheduleNextEvent('in', nextCheckinMs);
      }
      
      return res.status(200).json({ message: `Skipped. Reason: ${reason}` });
    }

    // 4. Frappe Login
    const loginResponse = await fetch('https://smb360.m.frappe.cloud/api/method/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usr: process.env.ATTENDANCE_USER,
        pwd: process.env.ATTENDANCE_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      const msg = 'Failed to authenticate with Frappe backend';
      await addLog('error', msg);
      return res.status(loginResponse.status).json({ error: msg });
    }

    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let sidCookie = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/sid=([^;]+)/);
      if (match) {
        sidCookie = `sid=${match[1]}`;
      }
    }

    if (!sidCookie) {
      const msg = 'Could not extract sid cookie from Frappe login';
      await addLog('error', msg);
      return res.status(500).json({ error: msg });
    }

    // 5. Frappe Check-In (Insert)
    const insertResponse = await fetch('https://smb360.m.frappe.cloud/api/method/frappe.client.insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sidCookie,
      },
      body: JSON.stringify({
        doc: {
          doctype: "Employee Checkin",
          employee: process.env.ATTENDANCE_EMPLOYEE_ID,
          log_type: logType,
          time: currentTimeIST,
        }
      }),
    });

    const insertData = await insertResponse.json();

    if (!insertResponse.ok) {
      const msg = `Failed to insert check-in log: ${JSON.stringify(insertData)}`;
      await addLog('error', 'API Error: Insert Failed');
      return res.status(insertResponse.status).json({ error: 'Failed to insert check-in log', details: insertData });
    }

    await addLog('success', 'Logged successfully');

    // 6. Schedule Next Loop Event
    if (action === 'in') {
      // Schedule check-out based on base_checkout_time
      const [outH, outM] = (settings.base_checkout_time || "19:10").split(':').map(Number);
      const randomOffsetMs = getRandomOffset() * 60 * 1000;
      const checkoutMs = toISTTimestamp(now, outH, outM) + randomOffsetMs;
      await scheduleNextEvent('out', checkoutMs);
    } else if (action === 'out') {
      // Schedule next check-in
      const nextCheckinMs = calculateNextCheckinMs(now);
      await scheduleNextEvent('in', nextCheckinMs);
    }

    return res.status(200).json({ message: 'Success', log_type: logType, time: currentTimeIST, data: insertData });
    
  } catch (error) {
    console.error('Error in attendance cron:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
