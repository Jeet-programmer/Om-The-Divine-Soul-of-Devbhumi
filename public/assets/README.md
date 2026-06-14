# Assets

Drop your real images here. The site reads from these paths — replace the
placeholders / reference images and everything updates automatically.

## Folder layout

| Folder | What goes here | Used by |
| ------ | -------------- | ------- |
| `hero/` | Wide hero background photo(s). Name the main one `hero.jpg` | Hero section background |
| `logo/` | The OM logo file. Name it `logo.png` (transparent) | Header + footer badge |
| `stays/` | Room photos — `glass.jpg`, `heritage.jpg`, `panchkedar.jpg` | Stays cards + booking modal |
| `gallery/` | Sanctuary / amenity photos | Sanctuary section |
| `venue/` | Vashishtha Bhawan venue photos — `venue.jpg` | Venue section |
| `reference/` | The original inspiration images from the design brief (already here) | reference only |

## How to wire an image in

1. Put the file in the right folder, e.g. `public/assets/hero/hero.jpg`.
2. The components already point at these paths. If a file is missing, an
   elegant labeled placeholder shows instead (so the site never looks broken).
3. To change a path, edit `lib/data.ts` (room images) or the relevant
   component in `components/`.

Recommended sizes: hero ≥ 2000px wide, room/venue photos ≥ 1200px wide, logo ≥ 200px.
