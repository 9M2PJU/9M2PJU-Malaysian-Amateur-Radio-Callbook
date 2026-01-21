# Self Hosting Guide

We provide a full Docker configuration for those who want to host their own private instance or ensure the project's survival if public clouds fail.

## Prerequisites
*   **Docker** & **Docker Compose** installed.
*   **Git** installed.

## Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/9M2PJU/9M2PJU-Malaysian-Amateur-Radio-Call-Book.git
    cd 9M2PJU-Malaysian-Amateur-Radio-Call-Book
    ```

2.  **Start the Stack**
    ```bash
    docker compose up -d
    ```

3.  **Access Services**
    *   **Web App**: `http://localhost:3000`
    *   **Supabase Studio**: `http://localhost:8001` (Default credentials in `docker-compose.yml`)
    *   **Mailpit** (Email Test): `http://localhost:8025`

## Environment Variables
Refer to `.env.example` to configure production keys if you are deploying to a public VPS. You will need to update:
*   `VITE_SUPABASE_URL`
*   `VITE_SUPABASE_ANON_KEY`
*   `DATABASE_URL`
