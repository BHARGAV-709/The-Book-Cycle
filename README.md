# The Book Cycle 📚🔄

**The Book Cycle** is a student-focused, peer-to-peer textbook reuse and exchange platform built to connect students on campus. It allows students to discover textbooks by course or subject, list used books for sale or exchange, submit meetup and exchange requests, and track transactions through a real-time student dashboard.

---

## 🌟 Key Features

### 1. 🔍 Book Discovery & Search
- **Full-Text Search:** Instantly search through listings by title, author, or ISBN.
- **Multi-Attribute Filters:** Filter by academic category (Computer Science, Engineering, Business, etc.), physical condition (New, Like New, Good, Fair), listing type (Free / Exchange vs. Cash), and availability status.
- **Flexible Sorting:** Sort results by newest listings or price (Low to High / High to Low).
- **Shareable URLs:** Filter state is synchronized with the browser URL using TanStack Router search validation, allowing direct linking to specific searches or categories.

### 2. 📖 Book Details & Request Flow
- **Detailed Overview:** View condition badges, ISBN, pricing, synopsis, and seller profile details.
- **Peer Exchange Modal:** Submit exchange requests specifying preferred on-campus meetup locations (Campus Library, Student Center, Department Lounge, etc.), personal notes, and counterparty contact numbers.
- **Role Awareness:** 
  - Guests are prompted to sign in to request.
  - Book owners cannot request their own listings and instead receive quick shortcuts to manage their book on the Dashboard.
- **Favorites & Wishlists:** 1-click favorite bookmarking that synchronizes with the user's dashboard.

### 3. ➕ List a Book (`/add-book`)
- Protected route requiring student authentication.
- Auto-populates the seller's campus information.
- Complete form validation for book title, author, subject category, ISBN, price, condition, exchange willingness, meetup location, and cover image.
- Listings immediately transition into real persistent storage and become discoverable across the platform.

### 4. 📊 Student Dashboard (`/dashboard`)
- **Overview:** Real-time metrics tracking Active Listings, Outgoing Requests, Incoming Requests, and Exchanged Books.
- **My Listings:** Manage active books, update statuses, or delete listings.
- **My Requests:**
  - **Incoming Requests:** Owners can accept or decline requests. Once accepted, student phone numbers and contact details are revealed to finalize meetup plans.
  - **Outgoing Requests:** Buyers/requesters can monitor pending, accepted, or rejected statuses.
- **Saved Books:** Quick access to all bookmarked titles.

### 5. 🤝 Exchange State Machine
The platform enforces a consistent state transition lifecycle:
```text
[AVAILABLE] 
    ↓ (Buyer submits request)
[PENDING] 
    ↓ (Owner reviews & accepts)
[ACCEPTED] (Contact details & meetup location unlocked)
    ↓ (Parties meet & exchange)
[EXCHANGED / COMPLETED] (Auto-rejects other pending requests for the book)
```

---

## 🛠️ Technology Stack

- **Framework:** React 19 + [@tanstack/react-start](https://tanstack.com/start) (Full-stack SSR / Vite framework)
- **Routing:** [@tanstack/react-router](https://tanstack.com/router) with strict type safety and URL search validation
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with curated student-friendly color tokens
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives & [Lucide React](https://lucide.dev/) icons
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Data & Auth Persistence:** High-reliability client-side storage architecture (`localStorage`) with reactive event listeners and automatic mock data seeding.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation & Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd second-chapter-market-clone-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000` (or the port specified in terminal output).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👥 Demo Accounts (1-Click Login)

The application comes pre-seeded with two student demo profiles for presentation and evaluation purposes:

| Student Name | Email | Role / University Info |
|---|---|---|
| **Alice Chen** | `alice@university.edu` | Computer Science, Year 3 |
| **Bob Smith** | `bob@university.edu` | Mechanical Engineering, Year 2 |

You can quickly switch between these accounts using the **"Quick Demo Login"** buttons on the `/login` page.

---

## 🎬 3-Minute Demonstration Script

1. **Discovery (0:00 - 1:00):**
   - Open `/` to view categories and recent listings.
   - Go to `/books` and search for *"Computer Science"*, filter by condition *"Like New"*, and sort by *"Price: Low to High"*.
2. **List a Book (1:00 - 1:45):**
   - Click **Sign In** -> Click **"Sign in as Alice Chen"**.
   - Navigate to `/add-book` and list a textbook (e.g., *"Operating Systems"* for Free/Exchange).
   - Verify the listing is published and you are redirected to the listing page.
3. **Request & Complete Exchange (1:45 - 3:00):**
   - Sign out of Alice and sign in as **Bob Smith**.
   - Navigate to Alice's book and click **"Request Book / Exchange"**. Add a meetup note and submit.
   - Book status transitions to **PENDING**.
   - Sign back in as **Alice**, open `/dashboard` -> **My Requests** -> **Incoming Requests**.
   - Click **Accept Request** (Bob's contact details appear).
   - Click **Mark as Completed** — the book status permanently updates to **EXCHANGED**.

---

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable layout and UI elements (Header, Footer, BookCard, etc.)
│   ├── lib/
│   │   ├── auth.tsx      # User authentication context and demo session management
│   │   ├── storage.ts   # Core storage engine, typed schemas, and state machine
│   │   └── books.ts     # Initial seed dataset
│   ├── routes/           # TanStack file-based router pages
│   │   ├── __root.tsx    # Root layout and global state providers
│   │   ├── index.tsx     # Landing page with hero & categories
│   │   ├── books.tsx     # Discovery catalog with filters, search, and sorting
│   │   ├── books.$id.tsx # Book details and exchange request modal
│   │   ├── add-book.tsx  # Create listing page
│   │   ├── dashboard.tsx # User dashboard (Listings, Requests, Favorites)
│   │   ├── categories.tsx# Subject category directory
│   │   ├── login.tsx     # Authentication and demo user selector
│   │   └── about.tsx     # About page & platform mission
│   └── main.tsx          # Application entry point
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite and Nitro bundler configuration
```

---

## 📄 License

This project is open-source and intended for educational and campus community use.
