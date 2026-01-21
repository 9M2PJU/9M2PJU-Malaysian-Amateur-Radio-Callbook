# Technical Architecture

## The "Zero-Cost" Philosophy

This project was engineered to run **indefinitely without monthly costs**. By leveraging the generous free tiers of modern cloud providers, we ensure the directory won't disappear due to lack of funding.

### Infrastructure Stack

| Component | Provider | Tier Limit Used (Approx) | Capacity |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | < 1% of 100GB Bandwidth | Millions of views/month |
| **Database** | **Supabase (PostgreSQL)** | ~1.1% of 500MB Storage | ~500,000 operators |
| **Auth** | **Supabase Auth** | < 1% of 50,000 MAU | 50,000 active users/month |
| **Images** | **External (Gravatar/FB)** | 0% (Hosted externally) | Unlimited |

### Capacity Analysis
*   **Database**: Each operator record is ~0.5KB. 
*   **Growth**: Even with 11,000 current records, we have enough space for the next **50 years** of growth.
*   **Bottlenecks**: 
    *   **Email**: Limited to 100/day (Service: Resend). Currently disabled to prevent quota spikes.
    *   **Storage**: Direct photo uploads are disabled to save check storage space.

### Security Measures
*   **Cloudflare Turnstile**: Protects forms from bots.
*   **Row Level Security (RLS)**: PostgreSQL policies ensure users can only edit their own data.
*   **Honeypot Fields**: Trap simple bots that ignore JS.
*   **Sanitization**: All inputs are sanitized to prevent XSS.
