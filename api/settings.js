export default async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'KV variables are not configured' });
  }

  // Simple PIN protection matching the frontend
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer 1234') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const kvGetResponse = await fetch(`${kvUrl}/get/attendance_settings`, {
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
      });

      const kvData = await kvGetResponse.json();
      let settings = { skip_today: false, holidays: [], skip_weekdays: [], logs: [], base_checkin_time: "10:00" };
      if (kvData && kvData.result) {
        settings = { ...settings, ...(typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result) };
      }

      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { skip_today, holidays, skip_weekdays, base_checkin_time } = req.body;
      
      // Fetch existing to preserve logs
      const kvGetResponse = await fetch(`${kvUrl}/get/attendance_settings`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      const kvData = await kvGetResponse.json();
      let existingSettings = { logs: [] };
      if (kvData && kvData.result) {
        existingSettings = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
      }

      const payload = {
        skip_today: !!skip_today,
        holidays: Array.isArray(holidays) ? holidays : [],
        skip_weekdays: Array.isArray(skip_weekdays) ? skip_weekdays : [],
        logs: existingSettings.logs || [],
        base_checkin_time: base_checkin_time || "10:00"
      };

      const setResponse = await fetch(`${kvUrl}/set/attendance_settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!setResponse.ok) {
        return res.status(500).json({ error: 'Failed to update settings in KV' });
      }

      return res.status(200).json({ message: 'Settings updated successfully', data: payload });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
