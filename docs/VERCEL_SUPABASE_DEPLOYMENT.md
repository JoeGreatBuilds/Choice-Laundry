# CHOICE LAUNDRY SERVICES — VERCEL & SUPABASE DEPLOYMENT GUIDE

This document provides step-by-step instructions for deploying Choice Laundry Services to production on Vercel with Supabase PostgreSQL and Auth.

---

## 1. Supabase Setup

1. **Create Project**:
   - Go to [database.new](https://database.new) and create a project named `choice-laundry-services`.
   - Note down your project database password and region.

2. **Execute Schema Migration**:
   - Navigate to the **SQL Editor** tab in Supabase.
   - Open and copy the contents of `supabase/migrations/20261102_choice_laundry.sql`.
   - Click **Run** to execute tables, indexes, and Row Level Security (RLS) policies.

3. **Configure Authentication**:
   - In Supabase, go to **Authentication** -> **Providers** -> **Email**.
   - Ensure Email signup is enabled.
   - Under **URL Configuration**, add your production Vercel domain to **Redirect URLs**.

4. **Create Initial Administrator**:
   - Sign up with your administrator email (e.g. `admin@choicelaundry.com`).
   - In Supabase Table Editor -> `profiles`, change the `role` column from `'customer'` to `'admin'`.

---

## 2. Environment Variables

Configure the following environment variables in your Vercel Project Settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Business WhatsApp Configuration
# (International format without spaces or symbols, e.g. 2348168137488)
NEXT_PUBLIC_WHATSAPP_NUMBER=2348168137488
```

---

## 3. Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
3. Select your repository.
4. Add the environment variables listed above.
5. Click **Deploy**.

---

## 4. WhatsApp Click-to-Chat Verification

Choice Laundry Services uses standard WhatsApp click-to-chat links:
`https://wa.me/234XXXXXXXXXX?text=ENCODED_MESSAGE`

1. Open **Admin Dashboard** -> **Business Settings**.
2. Verify or update the WhatsApp Number to your real business number (e.g., `2348168137488`).
3. Place a test booking using the quick booking system to ensure your WhatsApp client launches with the personalized message prefilled.
