export default async function handler(req, res) {
  try {
    const { action } = req.query;
    // valid actions: 'in', 'out', 'kickstart'
    if (!['in', 'out', 'kickstart'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // 1. Verify Authentication
    const authHeader = req.headers.authorization;
    if (action === 'kickstart') {
      if (authHeader !== 'Bearer 1234') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const logType = action === 'out' ? 'OUT' : 'IN';

    // 3. The Gatekeeper (KV Check)
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    const qstashToken = process.env.QSTASH_TOKEN;

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
      
      const targetUnix = Math.floor(targetTimestampMs / 1000);
      const url = `${baseUrl}/api/attendance?action=${nextAction}`;

      await fetch(`https://qstash.upstash.io/v2/publish/${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qstashToken}`,
          'Upstash-Forward-Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Upstash-Not-Before': targetUnix.toString()
        }
      });
      await addLog('info', `Scheduled next ${nextAction} at ${new Date(targetTimestampMs).toLocaleString()}`);
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

    const calculateNextCheckinMs = (baseDate) => {
      // Find the next valid day
      let nextDate = new Date(baseDate.getTime());
      nextDate.setDate(nextDate.getDate() + 1); // Start checking tomorrow
      
      while (true) {
        const parts = formatterIST.formatToParts(nextDate);
        const getP = (t) => parts.find(p => p.type === t)?.value;
        const dStr = `${getP('year')}-${getP('month')}-${getP('day')}`;
        const dow = nextDate.getDay();
        
        const isH = Array.isArray(settings.holidays) && settings.holidays.includes(dStr);
        const isW = Array.isArray(settings.skip_weekdays) && settings.skip_weekdays.includes(dow);
        
        if (!isH && !isW) {
          break; // Found a valid day
        }
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const [baseH, baseM] = (settings.base_checkin_time || "10:00").split(':').map(Number);
      nextDate.setHours(baseH, baseM, 0, 0);

      // Add random offset
      const offsetMs = getRandomOffset() * 60 * 1000;
      return nextDate.getTime() + offsetMs;
    };

    if (action === 'kickstart') {
      const nextMs = calculateNextCheckinMs(new Date(now.getTime() - 24*60*60*1000)); // Treat today as base so it schedules for today or tomorrow
      await scheduleNextEvent('in', nextMs);
      return res.status(200).json({ message: 'QStash loop successfully kickstarted!' });
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
    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const isSkipWeekday = Array.isArray(settings.skip_weekdays) && settings.skip_weekdays.includes(dayOfWeek);

    if (settings.skip_today || isHoliday || isSkipWeekday) {
      const reason = settings.skip_today ? "Skip Today is active" : (isHoliday ? "Holiday" : "Skipped Weekday");
      // (Self-cleanup rule)
      if (settings.skip_today) {
        settings.skip_today = false;
      }
      
      await addLog('skipped', reason);
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
      // Schedule check-out 9h10m later + random offset
      const baseDurationMs = (9 * 60 + 10) * 60 * 1000;
      const randomOffsetMs = getRandomOffset() * 60 * 1000;
      const checkoutMs = now.getTime() + baseDurationMs + randomOffsetMs;
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
