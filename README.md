# Mellow 🥐☕
> **Warmth in Every Bite, Art in Every Roast.**  
> An artisanal web application for Mellow Bakery & Specialty Coffee Roastery.

---

## 🎨 Official Brand Color Palette

Built using the official color system extracted from Mellow's brand guidelines:

| Swatch | Color Name | Hex Code | Usage |
| :---: | :--- | :--- | :--- |
| 🤎 | **Espresso Dark Brown** | `#332119` | Primary headings, dark section backgrounds, footer |
| 🍯 | **Mellow Honey Gold** | `#DC9D4E` | Official logo background, primary CTA buttons, badges |
| 🧱 | **Hearth Terracotta Rust** | `#C1694D` | Bake status indicators, prices, warm hearth highlights |
| 🌊 | **Highland Slate Teal** | `#4E777A` | Ethiopia Yirgacheffe coffee cards, cool accents |
| 🌿 | **Sage Olive Green** | `#A5B3A7` | Freshness pills & organic dietary tags |
| 📜 | **Parchment Cream & Kraft** | `#FAF5EE` / `#E8DAC6` | Soft linen backgrounds & kraft paper packaging |

---

## 🚀 Deploying to Netlify

This project is 100% pre-configured and deployment-ready for **Netlify**.

### Method 1: Automatic Deployment via GitHub (Recommended)
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and select your repository: `Devesh223/Mellow`.
4. Netlify will automatically detect `netlify.toml` with:
   - **Publish directory**: `.` (Root)
   - **Build command**: *(Leave empty)*
5. Click **Deploy Mellow**! Your site will be live instantly with global SSL and CDN caching.

### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy directly from terminal
netlify deploy --prod
```

---

## ✨ Features

- 🥐 **Artisanal Product Display**: Filterable menu showcasing Viennoiserie, Sourdoughs, Ethiopia Yirgacheffe single-origin coffee beans, and Celebration Tarts.
- 🛠️ **Interactive Order Simulator**:
  1. *Customize Box & Wax Seal*: Pick gift box bundles, select your signature hot wax seal stamp (*Hearth Terracotta, Honey Gold, Espresso, Slate Teal*), and add a handwritten note card.
  2. *Live Baking & Packaging Console*: Follow real-time animated stage progress:
     - 🥣 **Stage 1**: Kneading & Proofing (74°F)
     - 🔥 **Stage 2**: Stone Deck Oven Baking (375°F with live browning progress)
     - 🕯️ **Stage 3**: Hand-wrapping Kraft Paper & Hot Wax Stamping
     - ✨ **Stage 4**: Order Ready & Ticket Generation
  3. *Printable Receipt Ticket*: Instant printable ticket modal complete with barcode, customized wax seal name, and order meta.
- 🛍️ **Cart Drawer & Discount Engine**:
  - Live subtotal calculation & free shipping tracker ($35.00 threshold).
  - Promo code system: Apply **`MELLOW10`** for a 10% discount across your order.
- 📱 **Fully Responsive & Modern Design**: Smooth glassmorphism header, responsive layout, and mobile navigation.

---

## 📂 Repository Structure

```text
Mellow/
├── assets/
│   ├── brand/
│   │   ├── logo.jpg           # Official Mellow Brand Logo
│   │   ├── coffee_ref.jpg
│   │   ├── packaging_ref.jpg
│   │   └── palette_ref.jpg
│   └── images/
│       ├── hero.jpg           # Bakery Hero Spread
│       ├── coffee_beans.jpg   # Ethiopia Yirgacheffe Bag
│       ├── wax_package.jpg    # Wax-Sealed Gift Box
│       ├── croissant.jpg      # Almond Croissants
│       └── berry_tart.jpg     # Wild Berry Crème Tart
├── index.html                 # Semantic HTML5 Layout
├── styles.css                 # CSS Design System & Palette Variables
├── app.js                     # Interactive Logic & Simulator State Engine
├── netlify.toml               # Netlify Deployment Configuration
├── _redirects                 # SPA Clean Routing Rules
├── .gitignore
└── README.md
```

---

## 💻 How to Run Locally

Because the project is built with lightweight vanilla web standards, no complex build tools or dependencies are required.

### Option 1: Python HTTP Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/Devesh223/Mellow.git
cd Mellow

# Start local server
python -m http.server 8080
```
Open your browser at: `http://localhost:8080`

### Option 2: Node / Serve
```bash
npx serve .
```

---

## 📜 License & Credits

Designed & Crafted with ❤️ for **Mellow Bakery & Specialty Coffee Roastery**. All brand assets and logo guidelines are property of Mellow.
