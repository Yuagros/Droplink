# 🔗 DROPLINK

> **Upload. Share. Done.**

A modern, cyberpunk-styled file-sharing web application that generates instant download links via GoFile.io. Drop a file, get a shareable link - it's that simple.

![License](https://img.shields.io/badge/license-MIT-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

## ✨ Features

- 🎨 **Beautiful UI** - Cyberpunk-inspired dark theme with smooth animations
- 📦 **Large Files** - Support for files up to 5GB
- 🚀 **Fast Upload** - Real-time progress tracking
- 🔗 **Instant Links** - Shareable download links via GoFile.io
- 📱 **Responsive** - Works on desktop and mobile
- 🎯 **Drag & Drop** - Intuitive file upload interface
- 🔄 **Multi-file** - Queue and upload multiple files at once

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/droplink.git

# Navigate to project directory
cd droplink

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

1. Open `http://localhost:3000` in your browser
2. Drag and drop files onto the upload zone (or click to browse)
3. Click **"↑ GENERATE LINKS"**
4. Copy the download links and share them!

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Upload Handling**: Multer
- **File Hosting**: GoFile.io API
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Fonts**: JetBrains Mono, Bebas Neue

## 📁 Project Structure

```
droplink/
├── server.js           # Express backend server
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html      # Frontend (HTML + CSS + JS)
└── README.md
```

## 🎨 Design

- **Cyberpunk aesthetic** with vibrant yellow accents
- **Monospace fonts** for a developer-friendly look
- **Glassmorphism** effects and scanline overlay
- **Smooth animations** and micro-interactions

## 🔧 Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## 📝 API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - File upload (multipart/form-data)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- File hosting powered by [GoFile.io](https://gofile.io)
- Fonts from [Google Fonts](https://fonts.google.com)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ⚡ by [Your Name]**
