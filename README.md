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

## 🛡️ Project Legacy & Technical Decisions

> *"We built this to last forever, for free."*

This project was architected by **9M2PJU** with a specific mission: to provide a modern, interactive callbook for the Malaysian Amateur Radio community that can run **indefinitely without incurring monthly costs**. 

Every technical decision was made to ensure sustainability, preventing the project from disappearing due to lack of funding or server maintenance.

### 🏛️ The "Zero-Cost" Architecture
We utilize the generous free tiers of modern cloud infrastructure to guarantee longevity:
*   **Database (Supabase)**: We store text-based callsign data. With ~11k records currently, we utilize **< 6%** of the free 500MB limit. This capacity allows the directory to grow to **100,000+ operators** (sufficient for the next 10-20 years) without needing a paid plan.
*   **Hosting (Vercel)**: The frontend is static and cached globally. It handles traffic effortlessly within the 100GB/month bandwidth limit.
*   **Authentication**: Supabase Auth handles up to 50,000 monthly active users, far exceeding the size of our local community.

### ⚠️ The Disabled Email System (Important)
We built a fully functional **License Expiry Reminder System** (`supabase/functions/license-reminder`), designed to notify operators when their license is expiring (90, 60, 30, 14, 7, 3, 1 days before).

**However, we have intentionally DISABLED this feature (`const EMAIL_ENABLED = false`).**

**Why?**
The email service (Resend) provides **100 free emails/day**.
*   With 11,000 operators, we average ~42 reminder emails/day.
*   **The Risk**: If many licenses expire on the same day (a "cluster" event), the system would attempt to send >100 emails, hit the limit, and fail.
*   **The Decision**: To protect the project's free status, we disabled this potentially volatile feature. We prioritized **system stability** over this convenience feature.

### 🔮 Guide for Future Maintainers
If you are reading this in the future and wish to improve the project:

1.  **Re-enabling Emails**:
    *   If you have funding (~$20/mo), you can upgrade Resend and simply set `EMAIL_ENABLED = true` in the Edge Function.
    *   If staying free, you must optimize the logic to send fewer emails (e.g., only 3 reminders per expiring user instead of 7) to stay under the 100/day limit.

2.  **Image Hosting**:
    *   Do not store user profile photos in this Git repository. It will bloat the size and break the deployment. Use Supabase Storage (1GB free) instead.

3.  **Data Integrity**:
    *   The next great leap for this project would be automating the data sync with MCMC's public records, reducing the need for manual user submissions.


### 🚀 The "Dream" Architecture (Growth Plan)
**If resources/funding were unlimited**, this is how we envision the project evolving to support high-resolution photos, global traffic, and unlimited features:

1.  **Global Content Delivery (CDN)**:
    *   Deploy frontend via **Cloudflare Enterprise** or **AWS CloudFront** with edge caching.
    *   This ensures instant load times (<100ms) for operators in Europe, Americas, and Asia, not just Malaysia.

2.  **Database Replication & Clustering**:
    *   Implement **Read Replicas** in multiple regions (Singapore, Japan, US) to reduce database latency.
    *   Use **pgbouncer** for connection pooling to handle 100,000+ concurrent connections during major contests or events.

3.  **Dedicated Search Engine**:
    *   Integrate **Meilisearch** or **Elasticsearch** (replacing simple SQL `LIKE` queries).
    *   Enables typo-tolerance ("Fizul" finds "Faizul"), phonetic search, and instant millisecond search results for millions of records.

4.  **Unrestricted Object Storage (S3)**:
    *   Implement **AWS S3** or **MinIO** for storage.
    *   Allows hosting terabytes of high-resolution QSL cards, station event photos, and field day galleries.

5.  **Multi-Platform Native Apps**:
    *   Build **React Native** or **Flutter** apps iOS and Android.
    *   Enable **Offline Mode**: Download the entire database to the phone for use in deep jungle operations (zero coverage areas).

6.  **IoT & Digital Radio Integration**:
    *   Build an API Bridge for **DMR / C4FM / D-STAR** networks.
    *   Allow radios to query the callbook via digital packets directly from the transceiver.

> *"With my limited resources, I tried my best to build a foundation that is robust, free, and useful. I pass this torch to the community to take it even further."* — 9M2PJU

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

---

## 🐳 100% Self-Hosted Deployment (True Freedom)

To ensure this project can survive even if Vercel or Supabase cease to exist, we have included a **Full Stack Docker Configuration**.

This `docker-compose.yml` spins up the **entire infrastructure** locally:
*   **Web App**: The React Frontend (Port 3000)
*   **PostgreSQL**: The Database (Port 54322)
*   **Supabase Stack**: Auth (GoTrue), API (PostgREST), Realtime, Storage
*   **Dashboard**: Supabase Studio UI (Port 8001)
*   **Mailpit**: Local SMTP Server for testing emails (Port 8025)

### How to Run (Local / VPS)
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book.git
    cd 9M2PJU-Malaysian-Amateur-Radio-Call-Book
    ```

2.  **Start the Stack**:
    ```bash
    docker compose up -d
    ```

3.  **Access the Services**:
    *   **Public Directory**: `http://localhost:3000`
    *   **Backend Dashboard**: `http://localhost:8001` (Manage Data/Users)
    *   **Email Inbox**: `http://localhost:8025` (View sent emails)

> **Note**: This setup uses default "development" keys. For production use on a public server, please change the JWT secrets and passwords in `docker-compose.yml`.

---
Contributions welcome! Report bugs, suggest features, or submit PRs.

---

## 💌 Message from the Author

> "This project is an initiative by me for all Malaysian Amateur Radio Operators. I hope someone will improve this project later for future generations. Amateur Radio is always the greatest hobby of all."
> 
> — **9M2PJU**

---

<div align="center">

**Made with ❤️ for the Malaysian Ham Radio Community**

[![9M2PJU](https://img.shields.io/badge/Created_by-9M2PJU-00f2fe?style=for-the-badge)](https://hamradio.my)

*73 de 9M2PJU* 📻

</div>
