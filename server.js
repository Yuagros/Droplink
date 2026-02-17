const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Store file in memory (buffer), not disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 } // 5GB
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Upload endpoint — proxies file to GoFile server-side (avoids CORS)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Step 1: Get best available GoFile server
    const serverRes = await axios.get('https://api.gofile.io/servers', {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });

    const serverData = serverRes.data;
    if (serverData.status !== 'ok' || !serverData.data?.servers?.length) {
      throw new Error('Could not get upload server from GoFile');
    }

    const servers = serverData.data.servers;
    const server = servers[Math.floor(Math.random() * servers.length)].name;

    // Step 2: Upload to GoFile
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      knownLength: req.file.size
    });

    const uploadRes = await axios.post(
      `https://${server}.gofile.io/contents/uploadfile`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000 // 5 min for large files
      }
    );

    const uploadData = uploadRes.data;

    if (uploadData.status !== 'ok') {
      throw new Error(uploadData.message || 'GoFile upload failed');
    }

    const downloadPage = uploadData.data?.downloadPage || `https://gofile.io/d/${uploadData.data?.code}`;

    return res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
      url: downloadPage,
      code: uploadData.data?.code
    });

  } catch (err) {
    console.error('Upload error:', err.message);

    // Try fallback: direct upload to a known store server
    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        knownLength: req.file.size
      });

      const fallbackRes = await axios.post(
        'https://store1.gofile.io/contents/uploadfile',
        form,
        {
          headers: { ...form.getHeaders() },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 300000
        }
      );

      const d = fallbackRes.data;
      if (d.status === 'ok') {
        return res.json({
          success: true,
          filename: req.file.originalname,
          size: req.file.size,
          url: d.data?.downloadPage || `https://gofile.io/d/${d.data?.code}`,
          code: d.data?.code
        });
      }
    } catch (fallbackErr) {
      console.error('Fallback also failed:', fallbackErr.message);
    }

    return res.status(500).json({
      error: err.message || 'Upload failed. Check your internet connection.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🟢 DROPLINK running at http://localhost:${PORT}\n`);
});
