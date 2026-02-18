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

// Upload endpoint — proxies file to file.io for direct download links
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Upload to file.io which provides direct download links
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      knownLength: req.file.size
    });

    const uploadRes = await axios.post(
      'https://file.io',
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

    if (!uploadData.success) {
      throw new Error(uploadData.message || 'file.io upload failed');
    }

    // file.io returns a direct download link
    const directDownloadUrl = uploadData.link;

    return res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
      url: directDownloadUrl,
      expires: uploadData.expiry || '14 days'
    });

  } catch (err) {
    console.error('Upload error:', err.message);

    // Try fallback: use tmpfiles.org
    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        knownLength: req.file.size
      });

      const fallbackRes = await axios.post(
        'https://tmpfiles.org/api/v1/upload',
        form,
        {
          headers: { ...form.getHeaders() },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 300000
        }
      );

      const d = fallbackRes.data;
      if (d.status === 'success' && d.data?.url) {
        // tmpfiles.org gives URLs like https://tmpfiles.org/12345/file.txt
        // Convert to direct download: https://tmpfiles.org/dl/12345/file.txt
        const directUrl = d.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

        return res.json({
          success: true,
          filename: req.file.originalname,
          size: req.file.size,
          url: directUrl,
          expires: '1 hour'
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
