<div align="center">

# 🇲🇾 Malaysian Amateur Radio Callbook

### The Modern Interactive Directory for Malaysian Ham Radio Operators

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-callbook.hamradio.my-00f2fe?style=for-the-badge)](https://callbook.hamradio.my)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://callbook.hamradio.my)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-GPLv3-22c55e?style=flat-square)](LICENSE)

*A sleek, glassmorphism-styled directory for the Malaysian amateur radio community*

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **Authentication** | Secure Login & Registration powered by Supabase Auth |
| 📊 **Statistics Dashboard** | Real-time stats: total operators, breakdown by class, top locations |
| 🔍 **Advanced Search** | Filter by callsign, name, location, license class (A/B/C) |
| 📅 **License Status** | Indicators for **Active** (Green), **Expiring Soon** (Orange), and **Expired** (Red) licenses |
| 🏷️ **License Class Badges** | 🟢 Class A (9M) · 🔵 Class B (9W2/6/8) · 🟠 Class C (9W3) |
| 💾 **vCard Export** | Save any operator directly to phone contacts |
| 🔗 **Social Links** | QRZ.com, Facebook, personal websites |
| 📱 **Responsive Design** | Perfect fit on desktop and mobile |

---

## 🏗️ Project Architecture & Sustainability

This project is architected to run **indefinitely for free** using the generous tiers of modern cloud providers.

### Free Tier Strategy
*   **Database (Supabase)**: We store text-based callsign data. With ~11k records currently, we are using **< 6%** of the free 500MB limit. This supports growth for the next 5-10 years.
*   **Hosting (Vercel)**: Static frontend hosting handles our traffic with ease within the 100GB/month bandwidth limit.
*   **Authentication**: Supabase Auth handles up to 50,000 monthly active users (MAU), far exceeding our community size.

### ⚠️ Note on Automated Emails
We have developed a comprehensive **License Expiry Reminder System** using Supabase Edge Functions and Resend.

> **Status: DISABLED** 
> 
> *   **Reason**: The Resend free tier allows 100 emails/day. With ~11k users and a schedule of 7 reminders per user, a "cluster" of expirations on the same day could exceed this limit, causing failures.
> *   **Current State**: The code exists in `supabase/functions/license-reminder` but is strictly disabled (`const EMAIL_ENABLED = false`) to ensure zero maintenance costs and prevent quota errors.
> *   **What is enabled?**: Transactional emails for Sign Up, Password Reset, and Email Confirmation are handled natively by Supabase and **are fully functional**.

---

## 🔮 Future Roadmap & Improvements

To scale further or enable premium features, we have identified the following path:

### 1. Optimize Email Reminders
*   **Plan**: Reduce reminder frequency from 7 times to 3 times (e.g., 60, 30, and 7 days).
*   **Logic**: Implement priority sorting to ensure "Urgent" (7-day) reminders are always sent first if the daily limit is near.
*   **Goal**: Safely enable the reminder system within the free 100/day limit.

### 2. Image Hosting
*   **Challenge**: git repositories are not suitable for hosting thousands of user profile photos.
*   **Solution**: Integrate Supabase Storage for user avatars.
*   **Optimization**: Enforce client-side compression (WebP, max 100KB) to stay within the 1GB free storage limit.

### 3. Data Integrity
*   **Goal**: Automated sync with MCMC eSpectra public data to keep license status accurate without manual user updates.

---

## 🚀 Quick Start

### 🌐 View the Live Directory
**[callbook.hamradio.my](https://callbook.hamradio.my)**

> **Note**: You must **Register** or **Login** to view the directory. This protects the privacy of our operators.

### 📝 Register Your Callsign
1. **Sign Up** for an account on the website.
2. Click **"+ Add Callsign"** button in the navbar.
3. Fill out the form with your details.

---

## 🎨 Tech Stack

| | Technology | Purpose |
|-|------------|---------|
| ⚛️ | React 19 | UI Framework |
| ⚡ | Vite 7 | Build Tool |
| 🐘 | PostgreSQL | Database (Supabase) |
| 🎨 | CSS3 | Glassmorphism Styling |

---

## 🤝 Contributing

Contributions welcome! Report bugs, suggest features, or submit PRs.

---

## 💌 Message from the Author

> "This project is an initiative by me for all Malaysian Amateur Radio Operators. I hope someone will improve this later for future generations. Amateur Radio is always the greatest hobby of all."
> 
> — **9M2PJU**

---

<div align="center">

**Made with ❤️ for the Malaysian Ham Radio Community**

[![9M2PJU](https://img.shields.io/badge/Created_by-9M2PJU-00f2fe?style=for-the-badge)](https://hamradio.my)

*73 de 9M2PJU* 📻

</div>
