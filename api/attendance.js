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
    // Vercel KV returns { "result": "..." } where result is the stored string
    let settings = { skip_today: false, holidays: [] };
    if (kvData && kvData.result) {
      try {
        settings = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
      } catch (e) {
        console.error("Error parsing KV settings", e);
      }
    }

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

    if (settings.skip_today || isHoliday) {
      // (Self-cleanup rule)
      if (settings.skip_today) {
        settings.skip_today = false;
        await fetch(`${kvUrl}/set/attendance_settings`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        });
      }
      return res.status(200).json({ message: "Holiday/Skip active. No action taken" });
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
      return res.status(loginResponse.status).json({ error: 'Failed to authenticate with Frappe backend' });
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
      return res.status(500).json({ error: 'Could not extract sid cookie from Frappe login' });
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
      return res.status(insertResponse.status).json({ error: 'Failed to insert check-in log', details: insertData });
    }

    return res.status(200).json({ message: 'Success', log_type: logType, time: currentTimeIST, data: insertData });
    
  } catch (error) {
    console.error('Error in attendance cron:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
