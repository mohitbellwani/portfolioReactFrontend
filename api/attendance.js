export default async function handler(req, res) {
  try {
    // 1. Verify Authentication
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Action Determination
    const { action } = req.query;
    const logType = action === 'out' ? 'OUT' : 'IN';

    // 3. The Gatekeeper (KV Check)
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) {
      return res.status(500).json({ error: 'KV variables are not configured' });
    }

    const kvGetResponse = await fetch(`${kvUrl}/get/attendance_settings`, {
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });

    const kvData = await kvGetResponse.json();
    let settings = { skip_today: false, holidays: [], skip_weekdays: [], logs: [] };
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
    return res.status(200).json({ message: 'Success', log_type: logType, time: currentTimeIST, data: insertData });
    
  } catch (error) {
    console.error('Error in attendance cron:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
