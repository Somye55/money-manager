# 🌐 Setup ngrok for Mobile Testing

## Option 1: Install ngrok globally

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
cd client
npm run dev

# In another terminal, expose port 5173
ngrok http 5173
```

## Option 2: Use npx (no installation needed)

```bash
# Start your dev server
cd client
npm run dev

# In another terminal
npx ngrok http 5173
```

## After running ngrok:

1. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
2. Add this URL to Supabase redirect URLs
3. Access this URL from your phone

## Supabase Configuration:

Add these URLs to Authentication → URL Configuration:

- `http://localhost:5173` (local development)
- `https://your-ngrok-url.ngrok.io` (mobile testing)

## Benefits of ngrok:

- ✅ Works from any device/network
- ✅ HTTPS support (required for some OAuth providers)
- ✅ No need to configure local network
- ✅ Easy to share with team members
