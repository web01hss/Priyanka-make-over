# Priyanka Makeover Studio & Academy — Official Website & Admin Portal

> **Luxury Bridal Website with Attractive Purple & Pink Aesthetic, Smooth Animations, Dedicated Instagram Research Sector, Real Google Reviews, Live Supabase Backend & Full Admin Management Portal.**

---

## 🌸 Live Features Overview

1. **Attractive Luxury Purple & Pink Aesthetic (Default Dark Theme)**:
   - Deep Royal Plum (`#120317`), Amethyst Purple (`#8A2BE2`), and Radiant Peony Pink (`#FF2A85`).
   - Delicate animated shimmering gradient top border (3.5px).
   - High-contrast readability, glassmorphism cards, and interactive dark/light theme switchers.

2. **Supabase Database Integration (`bookings` table)**:
   - Connected to Supabase Project: `https://sikhychqetcddvhcrycq.supabase.co`
   - Real-time backend status pill above the booking form.
   - Dual-dispatch: Every booking saves directly to the database AND opens WhatsApp with structured details.

3. **👑 Dedicated Studio Admin Portal (`admin.html`)**:
   - Access URL: `http://localhost:8080/admin.html`
   - **Login Security**:
     - Studio Admin Credentials: Username: `admin` | Password: `admin123`
     - Supabase Auth Email/Password login integration.
     - "Remember Me" persistent session management.
   - **Real-Time Booking History & Metrics**:
     - Total Inquiries count.
     - Pending Review count (gold indicator).
     - Confirmed Brides count (emerald indicator).
     - Upcoming Weddings in next 30 days (purple indicator).
   - **Search, Filters & Layout Controls**:
     - Instant search across client name, phone, venue, service, or custom notes.
     - Status tabs: All, Pending, Confirmed, Completed, Cancelled.
     - Service category filter dropdown & date sorting.
     - Toggle between **Cards Grid View** and **Dense Table View**.
   - **Direct Bridal Client Dispatch**:
     - 💬 1-Click WhatsApp reply with pre-composed polite bridal confirmation message.
     - 📞 1-Click Call.
     - 👁️ Detailed Modal with client notes and customizable message templates.
     - ✏️ Live Status dropdown: changing status updates Supabase in real time!
     - 🗑️ Delete inquiry with safety confirmation dialog.
   - **Walk-in / Phone Booking Entry**:
     - Manual booking modal allowing the studio owner or receptionist to record new brides directly into Supabase.
   - **CSV / Excel Spreadsheet Export**:
     - 1-click download of all booking inquiries as a clean `.csv` file.

4. **Dedicated Instagram Sector ("Touch to Research Instagram")**:
   - Interactive research modal revealing cosmetic breakdowns, skin pairings, and direct IG links.

5. **Real 4.9★ Google Reviews & Ratings**:
   - 6 detailed client reviews with verified badges.

6. **Interactive Before & After Transformation Slider**:
   - Draggable slider comparing bridal prep to finished look.

---

## 🗄️ Supabase SQL Setup (Run in Supabase Dashboard)

If you haven't yet run the SQL in your Supabase SQL Editor, run this snippet to create the table and enable permissions:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_date DATE NOT NULL,
    service_type TEXT NOT NULL,
    venue_location TEXT DEFAULT 'Studio Visit',
    people_count TEXT DEFAULT '1 (Only Bride)',
    special_notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public insert from website form
CREATE POLICY "Allow public insert" ON public.bookings FOR INSERT WITH CHECK (true);

-- Allow public read access to display inquiries in admin portal
CREATE POLICY "Allow public read" ON public.bookings FOR SELECT USING (true);

-- Allow status updates from admin portal
CREATE POLICY "Allow public update" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);

-- Allow delete from admin portal
CREATE POLICY "Allow public delete" ON public.bookings FOR DELETE USING (true);
```

---

## 🚀 Live Access URLs

- **Client Studio Website:** [http://localhost:8080/](http://localhost:8080/)
- **Studio Admin Portal:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
  - **Username:** `admin`
  - **Password:** `admin123`
