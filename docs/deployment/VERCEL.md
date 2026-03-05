# Deploying My FootPrint to Vercel

Production deployment guide for the My FootPrint carbon footprint tracking application.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application
- A [Resend](https://resend.com) account
- The My FootPrint repository pushed to GitHub

---

## Step 1: Database Setup (Neon)

1. Create a new project in the [Neon Console](https://console.neon.tech).
2. Choose a region close to your Vercel deployment region (e.g., `us-east-1`).
3. Copy the **connection string** from the Neon dashboard. It will look like:
   ```
   postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/myfootprint?sslmode=require
   ```
4. Run database migrations locally against the Neon database:
   ```bash
   DATABASE_URL="your_neon_connection_string" npx drizzle-kit migrate
   ```

---

## Step 2: Clerk Setup

1. Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com).
2. Enable the authentication providers you want (e.g., Google OAuth, Apple OAuth, email/password).
3. Under **Paths**, configure:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/onboarding`
4. Under **Webhooks**, create a new endpoint:
   - URL: `https://yourdomain.com/api/webhooks/clerk`
   - Events to subscribe: `user.created`, `user.deleted`
   - Copy the **Signing Secret** (this is your `CLERK_WEBHOOK_SECRET`)
5. From the **API Keys** page, copy:
   - **Publishable Key** (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
   - **Secret Key** (`CLERK_SECRET_KEY`)

---

## Step 3: Resend Setup

1. Create a [Resend](https://resend.com) account.
2. Under **Domains**, add and verify the domain you will send emails from (e.g., `myfootprint.app`).
3. Under **API Keys**, create a new key with sending access.
4. Copy the API key (`RESEND_API_KEY`).
5. Decide on your sender address (e.g., `My FootPrint <noreply@myfootprint.app>`).

---

## Step 4: Vercel Deployment

1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import the My FootPrint GitHub repository.
3. Vercel will auto-detect Next.js. No build settings need to be changed.
4. Under **Environment Variables**, add all of the following:

   | Variable | Description | Required |
   |----------|-------------|----------|
   | `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
   | `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://myfootprint.app`) | Yes |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (starts with `pk_live_` or `pk_test_`) | Yes |
   | `CLERK_SECRET_KEY` | Clerk secret key (starts with `sk_live_` or `sk_test_`) | Yes |
   | `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret (starts with `whsec_`) | Yes |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path: `/sign-in` | Yes |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path: `/sign-up` | Yes |
   | `RESEND_API_KEY` | Resend API key (starts with `re_`) | Yes |
   | `EMAIL_FROM` | Sender address (e.g., `My FootPrint <noreply@myfootprint.app>`) | Yes |
   | `CRON_SECRET` | Secret token to protect the cron endpoint (generate a random string) | Yes |

5. Click **Deploy**.

---

## Step 5: Post-Deployment Verification

### Verify the health endpoint

```bash
curl https://yourdomain.com/api/health
# Expected: { "status": "ok", "timestamp": "...", "version": "0.1.0" }
```

### Verify Clerk webhook

1. In the Clerk Dashboard, go to **Webhooks** and check the delivery logs.
2. Create a test user and confirm the webhook fires successfully.
3. Check the Vercel function logs for `[Clerk Webhook]` messages.

### Verify cron job

The `vercel.json` file configures a weekly cron job that runs every Monday at 9 AM UTC:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

You can manually test the cron endpoint:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/weekly
```

### Verify database connection

1. Open the application in your browser.
2. Sign up a new user and complete onboarding.
3. Verify the user record appears in the Neon dashboard.

---

## Troubleshooting

### Build fails with "CLERK_SECRET_KEY is required"

The Dockerfile and Vercel build both set dummy values for Clerk keys at build time. If you see this error on Vercel, ensure the environment variables are set for the **Build** environment (not just Runtime).

### Cron job returns 401 Unauthorized

Verify that `CRON_SECRET` is set in the Vercel environment variables. Vercel automatically sends this as a Bearer token to your cron endpoint.

### Emails not sending

- Confirm your domain is verified in Resend.
- Check that `RESEND_API_KEY` is set correctly.
- Review Vercel function logs for error messages from the email send functions.

### Database connection errors

- Verify `DATABASE_URL` includes `?sslmode=require` for Neon connections.
- Ensure the Neon database is not paused (free tier databases auto-pause after inactivity).
