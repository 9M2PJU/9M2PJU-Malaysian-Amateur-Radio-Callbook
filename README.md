# Malaysian Amateur Radio Call Book

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

A modern, community-driven "Yellow Pages" for Malaysian Amateur Radio Operators (9M/9W). This project provides a searchable directory of amateur radio callsigns, names, and contact details, featuring a responsive UI and real-time filtering.

## Features

- **Real-time Search**: Instantly search by callsign, name, or location.
- **Advanced Filtering**: Filter operators by State (e.g., Selangor, Sabah) and License Class (Class A, B, C).
- **Recent Entries**: View the latest added operators.
- **Statistics Dashboard**: Quick insights into the database distribution.
- **Responsive Design**: optimized for desktop, tablet, and mobile devices.
- **Spam Protection**: Integrated with Altcha for secure interactions.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (implied by styling classes).
- **Backend/Database**: Supabase (PostgreSQL).
- **Security**: Row Level Security (RLS) enabled on Supabase.
- **API**: Vercel Serverless Functions (for Altcha challenge generation).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book.git
   cd 9M2PJU-Malaysian-Amateur-Radio-Call-Book
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ALTCHA_HMAC_KEY=your_secret_hmac_key # For server-side challenge generation
   ```

4. **Database Setup**
   Run the SQL scripts provided in `supabase-setup.sql` in your Supabase SQL Editor to set up the table and policies.

5. **Run Locally**
   ```bash
   npm run dev
   ```

## Database Schema

The project uses a primary table `callsigns`:
- `callsign`: Unique identifier.
- `name`: Operator name.
- `location`: State/Region.
- `license_class`: Derived from callsign prefix (9M = A, 9W2/9W6/9W8 = B, 9W3 = C).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
