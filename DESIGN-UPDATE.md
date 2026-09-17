# Actualizare vizuală — 17 septembrie 2026

Designul păstrează verdele și auriul. Corecțiile sunt în `visual-polish.css`, încărcat după stilurile existente, pentru a putea fi revizuite separat.

Corectat textul alb moștenit de cardurile albe din banda de informații pe mobil; contrastul textelor secundare, etichetele recomandate, prezentarea aparatelor fitness, meniul mobil și închiderea acestuia, selectorul duratelor și butonul de închidere al cardului. Bara flotantă a configuratorului se ascunde când sumarul este vizibil. Eliminat linkul mobil către secțiunea inexistentă Echipa.

Verificat vizual în browser la 390 × 844 și 1440 × 960: pagina principală și categoriile de servicii, despre, contact/footer, configuratorul și sumarul, previzualizarea cardului, autentificarea și dashboard-ul fără înregistrări. Nu au fost trimise mesaje WhatsApp și nu au fost înregistrate carduri de test în istoricul clientului. Aspectul unui dashboard cu înregistrări nu a fost verificat în browser deoarece sesiunea de test avea registrul gol.

## Pictogramă

Editare cu instrumentul integrat de generare a imaginilor, după imaginea `images/favicon.png`. Originalul a fost păstrat. Fișiere finale: `images/app-icon-green-192.png`, `images/app-icon-green-512.png`, `images/app-icon-green-maskable-512.png`, `images/apple-touch-icon-green.png`, `images/favicon-green.png`.

Prompt utilizat:

> Edit target: supplied Elyan Elixir logo. Create a square production mobile application icon. Preserve exact logo wording ELYAN and ELIXIR, classical serif lettering, horizontal ornaments and both infinity symbols. Replace the entire gray/yellow blurry background with solid deep emerald green #073b2d. Logo in crisp, clearly readable rich gold #e7c55b, flat clean edges, no glow, no embossed low-contrast effect. Center complete logo within central 75% of square with generous green padding for icon masks. No rounded corners baked in, no new elements, no extra text. High contrast luxury brand icon.

## Publicare

Încărcați pe GitHub `index.html`, `membership.html`, `dashboard.html`, `mobile-app.js`, `visual-polish.css`, `manifest.webmanifest`, `sw.js` și cele cinci pictograme noi din `images`. Service worker-ul are o versiune nouă a cache-ului. Unele sisteme pot păstra pictograma instalată anterior; în acel caz este necesară reinstalarea aplicației.
