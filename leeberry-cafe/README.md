# LEE BERRY CAFÉ — PREMIUM REFINED 3D & CINEMATIC DIGITAL EXPERIENCE

> *"GOOD FOOD. GREAT MOOD. PURE LEE BERRY."*  
> **Official Brand Tagline:** "Sip the happiness"  
> **Campus Flagship:** IIT Madras Campus, Chennai | **Urban Outlet:** Rajarajeshwari Nagar, Bangalore

---

## 🌟 Refinement Overview

This update elevates the **Lee Berry Café** website into a minimal, luxury, and visually sophisticated digital flagship experience. Rooted in the visual identity of the **Lee Berry logo**, it integrates the **uploaded cinematic food video** and **commercial photography assets** into scroll-based product storytelling.

---

## 🎨 Key Refinements & Enhancements

### 1. Brand Typography Aligned with Logo
- **Logo Character Analysis:** The Lee Berry logo features modern, rounded, geometric humanist lettering with open circular curves.
- **Display Typography (`Manrope`):** Premium, modern headings paired with clean `DM Sans` body typography.
- **Body & Interface (`DM Sans`):** A clean, readable sans-serif for product details, navigation and supporting copy.
- **Minimalist Luxury Styling:** Generous whitespace, refined line heights (1.05 - 1.15 for headings), and tight letter-spacing (`-0.02em` to `0.12em`).

### 2. Uploaded Media Integration
- **Cinematic Video Landing (`assets/videos/hero-cinematic.mp4`):**
  - Autoplaying, muted, looping background video with `object-fit: cover` and subtle dark gradient veil.
  - Paired with an interactive **Three.js WebGL layer** on top for floating 3D berries, mint leaves, and cursor parallax.
- **High-Resolution Blueberries Splash Photography (`assets/images/uploaded/blueberries-splash.jpg`):**
  - Featured in **Section 02 (Our Story)** as an overlapping parallax visual element and in **Section 03 (Specials)**.
- **Tall Iced Berry Cooler Photography (`assets/images/uploaded/berry-cooler-tall.jpg`):**
  - Featured as the hero visual for **Mojitos & Coolers** and the **Blue Berry Mojito** card on both Home and Flavours pages.

---

## 🏛️ Reorganized Page Structures

### A. Home Page (`index.html`) — 6 Structured Sections

1. **SECTION 01 — HOME / CINEMATIC LANDING:**
   - Fullscreen cinematic video background with layered gradient lighting.
   - Real-time Three.js drink chalice, textured blueberries, floating ingredients and interactive orbit.
   - Minimalist typography: *"GOOD FOOD. GREAT MOOD. PURE LEE BERRY."*
   - Audio synthesizer toggle for ambient café vibes.
   - "Explore 20 Flavours" and "Our Story" CTAs.
2. **SECTION 02 — OUR STORY:**
   - Editorial photography layout with the uploaded blueberries splash image.
   - Storytelling text highlighting the brand's roots at IIT Madras Campus.
   - 3 Pillars: *Cold-Pressed Extraction*, *100% Pure & Real*, *Heritage Reimagined*.
   - Impact metrics: *50+ Unique Creations*, *100k+ Happy Sips*, *4.9★ Campus Rating*.
3. **SECTION 03 — EXPLORE OUR FLAVOURS (CATEGORY SHOWCASE):**
   - Asymmetric editorial layout showcasing the 5 core menu categories:
     1. *Fresh Juices* (Cold-pressed watermelon, blue citrus coolers, sodas)
     2. *Milkshakes* (Belgian Biscoff, peanut brownie, fruit shakes)
     3. *Mojitos & Coolers* (Wild blueberry, garden mint, Sicilian lemon iced tea)
     4. *Snacks & Starters* (Heritage Kerala Avil Milk with roasted poha & nuts)
     5. *Signature Specials* (Coastal tender coconut, Malabar Sharja)
   - Clicking any category deep-links to `flavours.html?cat=[category]` and pre-filters the view!
4. **SECTION 04 — LEE BERRY MUST TRY:**
   - 6 standout recipes from the actual menu:
     - *Lotus Biscoff Shake (₹200)*
     - *Avil Special (₹90)*
     - *Blueberry Mojito (₹100)*
     - *Peanut Brownie Shake (₹160)*
     - *Tender Coconut Shake (₹95)*
     - *Sharja Shake (₹80)*
   - 3D card tilt & recipe detail modal triggers.
5. **SECTION 05 — FIND US:**
   - Dual location cards: IIT Madras Campus & Rajarajeshwari Nagar Bangalore.
   - Opening hours (9:00 AM – 11:30 PM), phone (`+91 91331 61559`), email (`info@leeberry.in`).
   - Styled dark-mode Google Maps iframe with "Get Directions" action.
   - Quick barista inquiry / event form.
6. **SECTION 06 — FOOTER:**
   - Minimalist footer with brand logo badge, navigation links, category shortcuts, and trademark notice.

---

### B. Flavours Page (`flavours.html`) — Cinematic Product Storytelling

- **A. Cinematic Introduction:**
  - *"DISCOVER YOUR NEXT FAVOURITE"* entrance typography and floating berry backdrop.
- **B. Interactive Sticky Category Bar:**
  - Sticky pill navigation: All (20), Fresh Juices (3), Milkshakes (7), Mojitos & Coolers (6), Snacks & Starters (2), Signature Specials (2).
  - Real-time instant search input.
- **C. Scroll-Based Product Storytelling:**
  - Full-screen spotlight spread for the signature item.
  - Alternating storytelling product rows with large photography, GSAP ScrollTrigger parallax scaling, price tags, ingredients badges, and Quick View modals.
  - Dynamic URL query parameter support (`?cat=juices`, `?cat=milkshakes`, etc.).
- **D. Product Detail Modal Dialog:**
  - High-res photography, complete recipe description, calorie information, preparation time, and counter pick-up trigger.

---

## 📁 Source Code Structure

```
leeberry-cafe/
├── index.html                 # Reorganized 6-Section Home Page
├── flavours.html              # Scroll-Based Product Storytelling Page
├── serve.py                   # Lightweight Local Python HTTP Server (Port 8080)
├── README.md                  # Comprehensive Documentation
├── assets/
│   ├── css/
│   │   └── style.css          # Minimal Luxury Stylesheet with Logo-Matched Typography
│   ├── js/
│   │   ├── hero-scene.js      # Three.js 3D WebGL Layer & Explosion Engine
│   │   ├── products-data.js   # Single Source of Truth for Menu & Category Taxonomy
│   │   ├── main.js            # Lenis Smooth Scroll, Cursor, Audio Synth & Modals
│   │   ├── flavours.js        # Flavours Page Storytelling Engine & Query Filter
│   │   └── vendor/            # Three.js, GSAP, ScrollTrigger, Lenis
│   ├── videos/
│   │   └── hero-cinematic.mp4 # Uploaded Cinematic Hero Food Video
│   └── images/
│       ├── leeberry-logo.png  # Official Round Lee Berry Brand Logo
│       ├── uploaded/
│       │   ├── blueberries-splash.jpg # Uploaded Splash Photography
│       │   └── berry-cooler-tall.jpg  # Uploaded Tall Drink Photography
│       ├── about/             # Café Ambience & Fruit Prep Photography
│       └── products/          # Studio Food Photography for Menu Items
```

---

## 🖥️ Live Preview Instructions

The local web server is active and serving the refined website at:
- **Home Page:** [http://localhost:8080/index.html](http://localhost:8080/index.html)
- **Flavours Page:** [http://localhost:8080/flavours.html](http://localhost:8080/flavours.html)
- **Category Deep-Links:**
  - [http://localhost:8080/flavours.html?cat=juices](http://localhost:8080/flavours.html?cat=juices)
  - [http://localhost:8080/flavours.html?cat=milkshakes](http://localhost:8080/flavours.html?cat=milkshakes)
  - [http://localhost:8080/flavours.html?cat=mojitos](http://localhost:8080/flavours.html?cat=mojitos)

To start or restart the server at any time:
```powershell
python C:\Users\aksha\.gemini\antigravity\scratch\leeberry-cafe\serve.py
```


### Menu layout update
- The Flavours page now groups products by category in touch-friendly horizontal scrolling rails.
- Category chips jump to a category or show all categories; search filters the visible product rails.
- The menu intro includes floating blueberry artwork styled to echo the landing page 3D berry animation.
