# v0-vg-aming-website-development

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_ovgs0qDVsACXECgGfPgTSdBrrOGp)

## Payment API Setup

This application integrates with MTN Mobile Money and Orange Money for real payment processing.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your API credentials:

```bash
cp .env.example .env.local
```

### MTN Mobile Money Setup

1. Visit [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Create a developer account
3. Register your application
4. Get your API Key, API Secret, and Subscription Key
5. Use sandbox environment for testing

### Orange Money Setup

1. Visit [Orange Developer Portal](https://developer.orange.com/)
2. Create a developer account
3. Register your application for Orange Money API
4. Get your Client ID, Client Secret, and Merchant Key
5. Use sandbox environment for testing

### Merchant Accounts

The application is configured with these merchant accounts:
- **MTN**: V GROUPE SARL (Account: 765064)
- **Orange**: V GROUP SARL (Account: 906608)

### Testing

Once configured, test payments will:
1. Initiate real payment requests to the mobile money providers
2. Send SMS prompts to users' phones
3. Process payments when users enter their PIN codes
4. Confirm successful payments and redirect to completion page

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/lontsimesmer/v0-vg-aming-website-development" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
