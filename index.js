// 📁 index.js
const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 사용 권장
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 허용
app.use(cors());

// 🔗 Google Apps Script 웹앱 주소 (본인의 것으로 교체!)
const GOOGLE_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbwRHJ1hqfDpDNUMV7bzsq8tUq-yUorMH3GGanHoAosKNdhELUTA8ur1qfq46az7dW-RAA/exec';

app.get('/inventory', async (req, res) => {
  const playerName = req.query.name;
  if (!playerName) {
    return res.status(400).send('Missing name parameter');
  }

  try {
    const scriptUrl = `${GOOGLE_SCRIPT_BASE_URL}?name=${encodeURIComponent(playerName)}`;
    console.log("Requesting: ", scriptUrl);
    const response = await fetch(scriptUrl);
    const html = await response.text(); // Apps Script가 HTML로 응답하면 text()

    res.send(html); // 그대로 클라이언트에게 전달
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).send('Failed to retrieve inventory');
  }
});

app.listen(PORT, () => {
  console.log(`Inventory proxy server running on http://localhost:${PORT}`);
});
