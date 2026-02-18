# DROPLINK

Dead simple file sharing. Upload a file, get a direct download link. That's it.

## What it does

Drop a file into the web interface, and you get back a URL. When someone visits that URL, the file downloads immediately - no landing pages, no ads, no BS.

Built this because I was tired of file sharing services that make you click through a bunch of pages just to download a file.

## Features

- Drag & drop interface
- Files up to 5GB
- Direct download links (no landing pages)
- Real-time upload progress
- Clean, dark UI
- Upload multiple files at once

## Running it

```bash
git clone https://github.com/Yuagros/Droplink.git
cd Droplink
npm install
npm start
```

Open http://localhost:3000 and you're good to go.

## How it works

The backend (Express + Node.js) takes your file and uploads it to file.io, which gives back a direct download URL. The frontend is just vanilla HTML/CSS/JS - no framework bloat.

Files are stored on file.io for 14 days, then auto-deleted. If file.io is down, it falls back to tmpfiles.org (1 hour expiration).

## Project structure

```
droplink/
├── server.js           # Backend API
├── package.json        # Dependencies
└── public/
    └── index.html      # Frontend (everything in one file)
```

## Deploy it

Works on pretty much any Node.js host:
- Heroku
- Railway
- Vercel
- Cloudflare Pages
- Your own VPS

Just point it at the repo and it should work.

## Tech

- Node.js + Express for the backend
- Multer for file uploads
- file.io API for hosting (with tmpfiles.org fallback)
- Vanilla JavaScript on the frontend

## Contributing

Found a bug or want to add something? PRs are welcome.

## Notes

- file.io links expire after one download (by default) or 14 days
- If you need permanent storage, swap out file.io for your own storage solution
- Max file size is 5GB (limited by file.io)

## Credits

Made by **Yuagros**

Uses file.io for hosting and Google Fonts (JetBrains Mono, Bebas Neue) for typography.

## License

MIT - do whatever you want with it.

**⚠️ Legal Disclaimer:** This software is provided for legitimate file sharing purposes only. The author (Yuagros) is not responsible for any misuse of this software. Do not use this tool to share illegal content, copyrighted material without permission, malware, or anything that violates local laws. Use responsibly and at your own risk.
