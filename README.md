<div align="center">

# 🇲🇾 Malaysian Amateur Radio Call Book

### The Modern Interactive Directory for Malaysian Ham Radio Operators

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-callbook.hamradio.my-00f2fe?style=for-the-badge)](https://callbook.hamradio.my)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://9m2pju.github.io/9M2PJU-Malaysian-Amateur-Radio-Call-Book/)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Open_Source-22c55e?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=flat-square)](https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book/pulls)

<br/>

<img src="https://raw.githubusercontent.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book/main/public/preview.png" alt="MY-Callbook Preview" width="800"/>

*A sleek, glassmorphism-styled directory for the Malaysian amateur radio community*

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Statistics Dashboard
Real-time statistics showing:
- Total registered operators
- Breakdown by license class
- Top locations ranking
- Recently added count

</td>
<td width="50%">

### 🔍 Advanced Search
Powerful filtering options:
- Search by callsign, name, or location
- Filter by Malaysian state
- Filter by license class (A/B/C)
- Filter by recently added

</td>
</tr>
<tr>
<td width="50%">

### 🏷️ License Class Badges
Color-coded indicators:
- 🟢 **Class A** (9M) - Full License
- 🔵 **Class B** (9W2/6/8)
- 🟠 **Class C** (9W3)

</td>
<td width="50%">

### 📱 Mobile Responsive
- Glassmorphism UI design
- Perfect fit on all devices
- Smooth animations
- Dark theme optimized

</td>
</tr>
<tr>
<td width="50%">

### 💾 vCard Export
- Save contacts directly to phone
- One-click download
- Includes all contact details
- VCF format compatible

</td>
<td width="50%">

### 🔗 Social Integration
- QRZ.com profile links
- Facebook integration
- Personal website links
- Email & phone direct links

</td>
</tr>
</table>

---

## 🚀 Quick Start

### View the Live Directory
Visit **[callbook.hamradio.my](https://callbook.hamradio.my)** to browse the directory.

### Register Your Callsign
1. Click the **"+ Register / Update"** button
2. Email your details to `9m2pju@hamradio.my`
3. Your entry will be added to the directory

### Registration Format
```
Callsign: [Your Callsign]
Name: [Your Name]
Location: [State/City]
Email: [Optional]
Phone: [Optional]
Address: [Optional]
Website: [Optional]
Facebook: [Optional - Full URL]
QRZ.com: [Optional - Full URL]
```

> ⚠️ **Privacy Notice**: All submitted information will be publicly visible. Only submit details you're comfortable sharing.

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Setup
```bash
# Clone the repository
git clone https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book.git
cd 9M2PJU-Malaysian-Amateur-Radio-Call-Book

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
├── public/
│   ├── callsigns.json    # 📡 Operator data (edit directly on GitHub)
│   └── CNAME             # Custom domain config
├── src/
│   ├── components/
│   │   ├── AdvancedSearch.jsx
│   │   ├── Card.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── StatsDashboard.jsx
│   │   └── SubmissionModal.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

---

## 📡 Data Updates

The callsign data is stored in `public/callsigns.json` and loaded **directly from GitHub** at runtime. This means:

- ✅ No rebuild needed when adding new operators
- ✅ Edit the JSON file directly on GitHub
- ✅ Changes appear immediately after page refresh

### JSON Format
```json
{
  "callsign": "9M2PJU",
  "name": "FAIZUL",
  "location": "KUALA LUMPUR",
  "email": "9m2pju@hamradio.my",
  "phone": "+6012-3456789",
  "address": "123, Jalan Radio, 68000 Ampang",
  "website": "https://hamradio.my",
  "facebook": "https://facebook.com/9m2pju",
  "qrz": "https://www.qrz.com/db/9M2PJU",
  "addedDate": "2026-01-10"
}
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Framework |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build Tool |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Glassmorphism Styling |
| ![GitHub Pages](https://img.shields.io/badge/-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white) | Hosting |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## 📄 License

This project is open source and available for the Malaysian amateur radio community.

---

<div align="center">

**Made with ❤️ for the Malaysian Ham Radio Community**

[![9M2PJU](https://img.shields.io/badge/Created_by-9M2PJU-00f2fe?style=for-the-badge)](https://hamradio.my)

*73 de 9M2PJU* 📻

</div>
