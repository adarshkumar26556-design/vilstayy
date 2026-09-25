# Vilstay website redesign — discovery layout

The `dist` folder contains the complete static website. Styling is entirely Tailwind CSS, loaded through the CDN. There is no React, Bootstrap, UI component library or build step. Vanilla JavaScript provides the requested interactions.

## Preview

With Node.js installed, run `node preview.cjs` from this folder and open http://127.0.0.1:4174. Internet access is required for Tailwind, Google Fonts and property photography. Upload the contents of `dist` to any static web host to deploy.

## Files

- `dist/index.html`: home page and exactly six property cards
- `dist/properties.html`: all six stays, destination search
- `dist/about.html`: brand story
- `dist/contact.html`: booking enquiry form
- `dist/property.html`: reusable detail page selected with `?id=...`
- `dist/css/style.css`: retained stylesheet entry point; styling uses Tailwind utilities
- `dist/js/main.js`: navigation, validation, filters and detail-page rendering
- `dist/js/data.json`: six property records

## Latest design update

The interface now follows the discovery pattern of the user-provided HireACamp reference: centred photographic hero, prominent rounded search, destination shortcuts, icon category filters, clean sans-serif headings, rounded photography and a white/green palette. Vilstay retains its own content and six properties.

Category filters and property-name search were verified in the browser. Mobile layout was checked at 375px with no horizontal overflow.

## What works

Responsive 1/2/3-column property grids, transparent-to-solid sticky navigation, mobile menu, clickable cards, all six detail views, local destination filtering, empty results, date validation, query-preserving booking links, WhatsApp enquiry preparation, image hover transitions, reduced-motion-aware scroll reveals and keyboard-accessible forms.

Bookings are enquiries. Rates, live availability, payment, confirmation and cancellation terms are not connected to a reservation system. The guest reviews are clearly labelled illustrative examples. Replace them with approved real reviews before public launch.

## Content requiring final brand assets

- Five property photos and the public phone number come from https://vilstay.com/.
- Edakkal Village Resort uses its property photo from the matching Goibibo listing. Image source URLs are recorded in `dist/js/data.json`.
- Destination and experience photos are reused collection imagery, not verified destination panoramas.
- The current site's email address was obfuscated. The email enquiry link points to its official contact page instead of inventing an address.
- Instagram and Facebook links open brand searches until verified profile URLs are supplied.

## Validation completed

- JavaScript syntax check passed.
- Five HTML pages and local file links checked.
- Exactly six property cards on the homepage and collection page.
- Browser checks at 375px and 1440px; no horizontal overflow in checked views.
- Mobile menu opened and navigated to About successfully.
- Wayanad filter returned two properties.
- Property detail and enquiry navigation preserved the selected property.
- Invalid check-out date produced the correct validation message.
- All five source image URLs loaded in the browser.

## Publishing status

The private Sites project was registered, but publication could not complete because the installed plugin's required `site-workflow.mjs` helper is absent. No changes were made to the existing Vilstay.com website. The static files are ready to host independently.

## Property card refinement
Property cards now use portrait photography, compact details, four columns on wide screens. Vilstay Premium and Vilstay Go labels have been removed. All six stays remain. No unverified ratings or prices were added.


Favourite buttons and the saved-only filter have been removed from all pages.

## Property photo matching
All six property records now include matching photo sources. Five use Vilstay’s official property images; Edakkal uses https://www.goibibo.com/hotels/photos-of-dazzle-edakkal-village-resort-hotel-in-wayanad-8352726341668465722/ . The Edakkal photo was verified to load in the browser at 3471 pixels wide.

## Confirmed Edakkal source
The user supplied https://vilstay.boltlabs.app/ as the correct Vilstay Edakkal Village Resort website. Its main photo now replaces the earlier third-party photo. The location, description and three amenities are taken from this supplied listing.

## Brand Logo & Terracotta Theme Overhaul (Mobile-First)
- **Official Brand Theme**: Shifted from green to the warm, authentic Kerala terracotta/brick-red (`#b1493e`) sampled directly from the official circular Vilstay logo, paired with warm cream (`#fff9df`), sand (`#f8f4ee`), honey amber (`#d98c45`), and espresso charcoal (`#2b2321`).
- **Brand Mark & Favicon**: Added the official circular logo avatar (`dist/images/vilstay-logo.jpg`) to navigation bars, mobile drawer, and footers, with an SVG fallback and `<meta name="theme-color" content="#b1493e">`.
- **Mobile-First UX Optimization**:
  - Horizontal swipeable category chips with smooth overflow and active terracotta indicators.
  - Responsive search bar with 16px text size to prevent iOS Safari auto-zoom.
  - Touch-friendly 44px+ tap targets, frosted glass badges, and 2x2 destination and value grids on mobile.
  - Floating bottom sticky action bar on mobile (`< 640px`) with instant WhatsApp enquiry, direct phone call, and quick booking access.
  - Redesigned mobile navigation drawer with brand header, clear touch rows, and quick contact buttons.

