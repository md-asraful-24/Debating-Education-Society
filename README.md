# Debating Education Society in Bangladesh (DESB)

A modern, high-performance, bilingual (Bangla & English) web platform designed for the **Debating Education Society in Bangladesh**, built with **Next.js (App Router)**, **Tailwind CSS**, and cloud database architecture ready for **Vercel** deployment.

---

## 🌟 Key Features Implemented

### 1. Bilingual System (Bangla & English)
- Complete site-wide localization toggle between **বাংলা** and **English**.
- **Footer Language Switcher**: Prominently placed toggle at the bottom of the footer (in addition to navigation header toggle).
- Persistent language preference across reloads.

### 2. Strict Gmail Authentication & Time-Limited OTP
- Registration and login are strictly restricted to valid `@gmail.com` accounts.
- 5-minute time-limited cryptographic 6-digit OTP verification.
- Passwords securely hashed with `bcryptjs`.
- Session tokens signed with JWT and stored in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
- Gmail SMTP integration ready via `nodemailer` (with interactive fallback and developer OTP banner for instant local testing).

### 3. Role-Based Navigation & Communication Center
- **Admin Panel**: Visible in navigation strictly for authenticated admin users; completely hidden from regular members.
- **Settings**: Password change section with a clear **Back Button** inside settings views.
- **General Bangla Chat**: Universal chat room where all verified members and adjudicators can discuss topics and ask questions.
- **Debate Group Chats**: Restricted private rooms for assigned 3-member debate teams (Team Alpha / Government & Team Beta / Opposition) and judges/panel with server-side RBAC protection.

### 4. Homepage Hero Banner & Auto-Sliding Carousel
- Prominently showcases **"Debating Education Society in Bangladesh"** on the first slide.
- Multiple admin-managed images that auto-slide every 30 seconds with a visual countdown timer and progress indicator.
- **Per-image toggle** in the Admin Panel to show or hide title/overlay text on subsequent slides.

### 5. Debate Schedule & Time-Locked Google Meet
- Real-time debate schedule cards displaying date, time, debate motion, team rosters, and judges.
- **Server-enforced Time-Lock**: Join Meet option unlocks strictly **5 to 7 minutes** before the scheduled debate start time (e.g. 5:53–5:55 PM for a 6:00 PM debate) and returns HTTP 403 with exact countdown seconds beforehand.

### 6. Debate Results & Automatic Winner Display
- Dedicated **Debate Results / ফলাফল ও বিজয়ী** section.
- Automatic winner highlights featuring:
  - **Today's Winner** (আজকের বিজয়ী)
  - **Yesterday's Winner** (গতকালের বিজয়ী)
  - **Date-based Archive** (ফলাফল আর্কাইভ)
- Displays winning team, best debater, speaker scores, judge feedback remarks, and celebratory confetti.

### 7. Built-In CV Maker & Clean PDF Export
- 100% structured after the reference CV format (`zahid vi.pdf`):
  - Profile photo upload and preview
  - Name header: *Curriculum Vitae of MD ZAHID HASAN .*
  - Contact No, Email, Present & Permanent Address
  - **CAREER OBJECTIVE** (distinctive banner styling)
  - **PERSONAL ATTRIBUTES** (dynamic add/remove items)
  - **EDUCATIONAL QUALIFICATIONS** table with Add Row & Delete Row support (Qualification, Group, Institution Name, GPA, Passing Year)
  - **INTEREST & HOBBY**
  - **LANGUAGE PROFICIENCY**
  - **PERSONAL DETAILS** (Father's Name, Mother's Name, Date of Birth, Nationality, NID, Religion, Marital Status, Sex, Height, Weight, Blood Group)
  - Official declaration box & signature line
  - Clean PDF download and print stylesheet.

### 8. Dynamic Footer & About (Admin-Editable)
- Stored dynamically in the database so administrators can modify details without touching code:
  - Official Gmail
  - Physical Address
  - Contact Phone
  - Facebook Page Link
  - Debate Information & Resources
  - Current Leadership & Moderation council list
- **About & Code of Conduct**:
  - Full project & society details in Bangla and English.
  - Strict zero-tolerance anti-harassment policy with clear 4-tier admin enforcement pipeline (Warning, Kick, Temp Ban, Permanent Ban).

### 9. Admin Controls & Dynamic Website Themes
- **Slider Manager**: Add/edit/delete slides, set URLs, titles, and toggle overlay text visibility.
- **User Manager**: Moderate users, issue kicks/bans, promote roles (Admin, Moderator, Member), and assign teams and panel seats.
- **Debate & Results Manager**: Schedule debate sessions, set Meet links and unlock windows, and publish winner scores.
- **Dynamic Theme Switcher**: 5 built-in palettes (**Emerald**, **Crimson**, **Royal Blue**, **Midnight**, and **Sunset**) that update site-wide.

---

## 🚀 Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Testing Accounts

| Role | Gmail Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `AdminPassword123!` | Full control over sliders, debates, users, results, footer, and themes |
| **Moderator** | `moderator@gmail.com` | `ModeratorPassword123!` | Panel adjudicator & moderation privileges |
| **Debater 1** | `zahidmaxshahi@gmail.com` | `DebaterPassword123!` | Assigned to Team Alpha (Government) |
| **Debater 2** | `farzana.debater@gmail.com` | `DebaterPassword123!` | Assigned to Team Beta (Opposition) |

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `JWT_SECRET`: A secure random secret string.
   - `GMAIL_USER` *(optional)*: Your Gmail address for sending live OTP emails.
   - `GMAIL_APP_PASSWORD` *(optional)*: 16-character Google App Password.
   - `DATABASE_URL` *(optional)*: Supabase PostgreSQL connection string if using Supabase.
4. Click **Deploy**. Vercel will build and deploy the application automatically.
