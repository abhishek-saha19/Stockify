# Stockify 📈

**A Modern, Real-Time Stock Portfolio Tracker & Discovery App.**

Built with **Next.js 14**, **Firebase**, and **Real-Time APIs**, Stockify reimagines how users explore the market using a Tinder-style swipe interface for discovery and a robust watchlist for tracking.

![Stockify Banner](https://placehold.co/1200x600/18181b/ffffff?text=Stockify+Dashboard)
*(Replace with actual screenshot)*

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (Swipe Gestures)
- **Backend (Serverless):** [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Data Provider:** [Finnhub API](https://finnhub.io/) (Real-time Pricing)

## ✨ Key Features

### 1. Hybrid Data Architecture ⚡
- **Instant Search:** Uses a local, optimized directory cache for "Market Overview" and "Search" to ensure **0ms latency** and preserve API rate limits.
- **Live Pricing:** Dynamically fetches real-time data from Finnhub *only* for the user's specific watchlist.

### 2. "Tinder for Stocks" Discovery 🃏
- Interactive swipe card interface (`SwipeableCard.tsx`) using `framer-motion`.
- **Swipe Right** to instantly add to Watchlist.
- **Swipe Left** to discard.

### 3. Real-Time Watchlist 📊
- Persisted across devices using **Cloud Firestore**.
- Optimistic UI updates for instant feedback.
- Sort by Price, Change %, or Name.

### 4. Secure Authentication 🔐
- Fully implemented Email/Password flow using **Firebase Auth**.
- Secure, protected routes and profile management.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- A Firebase Project
- A Finnhub API Key (Free Tier)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/stockify.git
   cd stockify/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Finnhub API (Real-time Data)
   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📸 Screenshots

| Discover (Swipe) | Watchlist (Real-Time) |
|:---:|:---:|
| ![Discover](https://placehold.co/600x400/18181b/ffffff?text=Swipe+Interface) | ![Watchlist](https://placehold.co/600x400/18181b/ffffff?text=Real+Time+Data) |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
