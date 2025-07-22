
# CircleUp Full-Stack

A **Next.js 15** (App Router) + **Prisma** + **Clerk** starter for a social feed with posts, comments & likes.

---

## 🚀 Features

- Next.js App Router with React Server & Client Components  
- Clerk for authentication  
- Prisma ORM with a MySQL database (via Docker)  
- Cloudinary support for media uploads  
- Optimistic updates for comments & likes  
- Emoji picker via emoji-mart

---

## 📦 Prerequisites

- Node.js 18+  
- Docker & Docker Compose  
- A Clerk account (free tier)

---

## 🛠️ Quickstart

### 1. Clone the repo

```bash
git clone https://github.com/your-org/circle-up-full-stack.git
cd circle-up-full-stack
````

---

### 2. Setup `.env.local`

Create and edit `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your `.env.local` with actual values:

```env
# Clerk (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# MySQL
DATABASE_URL="mysql://root:pass123@localhost:3306/circleup"

# Cloudinary (get from https://cloudinary.com/)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Local dev base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### 3. Set up MySQL with Docker

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ****
      MYSQL_DATABASE: circleup
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Then run:

```bash
docker-compose up -d
```

---

### 4. Install dependencies and setup DB

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

---

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Scripts

| Script                   | Description              |
| ------------------------ | ------------------------ |
| `npm run dev`            | Start the dev server     |
| `npm run build`          | Create production build  |
| `npm start`              | Run production server    |
| `npx prisma studio`      | Visual DB UI             |
| `npx prisma migrate dev` | Apply schema & update DB |

---

## 🎨 Emoji Picker

We use `emoji-mart` dynamically on client side:

```tsx
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("@emoji-mart/react").then(mod => mod.Picker), { ssr: false });
```

Usage:

```tsx
<Picker
  onEmojiSelect={(emoji) => setDesc(prev => prev + emoji.native)}
  previewPosition="none"
  perLine={8}
  emojiSize={20}
/>
```

---

## ✅ Authentication

* Uses Clerk for user auth
* Environment variables are configured above
* Routes protected via `<ClerkProvider>` in `layout.tsx`

---

## 📤 Deployment

1. Host MySQL externally (e.g. PlanetScale or AWS RDS)
2. Set proper `DATABASE_URL` in `.env.production`
3. Configure Clerk variables in Vercel/Netlify
4. Run `npx prisma migrate deploy` on deploy

---

## 🤝 Contributing

1. Fork & clone the repo
2. Create a branch (`feature/your-feature`)
3. Commit changes
4. Push and open a PR

---

Thanks for using **CircleUp** 🎉

