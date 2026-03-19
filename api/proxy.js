// api/proxy.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Chrome'un CORS engelini kaldıran sihirli satırlar
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  let hedefYol = req.query.yol;
  if (!hedefYol) return res.status(400).json({ error: 'Yol belirtilmedi' });
  
  // Baştaki eğik çizgiyi temizle (hata olmaması için)
  if (hedefYol.startsWith('/')) hedefYol = hedefYol.substring(1);

  try {
    const tkgmResponse = await axios.get(`https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1/api/${hedefYol}`, {
      headers: {
        'Referer': 'https://parselsorgu.tkgm.gov.tr/',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    // TKGM'den gelen gerçek veriyi senin HTML'ine yolluyoruz
    res.status(200).json(tkgmResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'TKGM bağlantı hatası' });
  }
};
