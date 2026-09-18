# SEO și lansarea domeniului Elyan Elixir 88

Adresa canonică pregătită în cod: https://www.elyanelixir88.ro/

## Ce este implementat

- Titluri și descrieri distincte pentru pagina principală și configurator.
- Localitatea Târgu Cărbunești în H1, titluri și conținut, fără repetări artificiale de cuvinte-cheie.
- Date structurate JSON-LD pentru salon, adresa și programul afișate pe site, website și navigarea configuratorului. Nu au fost inventate recenzii, ratinguri sau acreditări.
- Adrese canonice și metadate pentru distribuire pe rețele sociale.
- `sitemap.xml` cu cele două pagini publice. Secțiunile cu `#` nu sunt pagini separate și nu se listează individual.
- `robots.txt` permite crawl-ul. Dashboard-ul nu este în sitemap și păstrează `noindex,nofollow`. Robots/noindex nu sunt mecanisme de securitate.
- Întrebări frecvente vizibile despre locație, programări și regulile reale ale abonamentelor.

## Pași necesari după publicare

1. Dețineți domeniul și configurați DNS-ul către găzduirea aleasă. Codul nu înregistrează și nu conectează domeniul.
2. Activați HTTPS valid. Folosiți www ca versiune principală și configurați redirecționări permanente de la domeniul fără www și de la HTTP. Evitați buclele de redirecționare.
3. Dacă rămâneți pe GitHub Pages, configurați Custom domain în Settings → Pages și DNS conform documentației GitHub. Nu adăugați domeniul în Pages înainte de a deține și verifica domeniul. Asigurați-vă că vechea adresă GitHub Pages redirecționează corect.
4. Verificați că https://www.elyanelixir88.ro/, /membership.html, /robots.txt, /sitemap.xml și imaginile se deschid fără erori. Nu trimiteți sitemap-ul nou cât timp domeniul nu este funcțional.
5. Adăugați proprietatea de domeniu `elyanelixir88.ro` în Google Search Console și verificați-o prin înregistrarea DNS TXT oferită de Google. Nu introduceți valori TXT inventate.
6. Trimiteți `sitemap.xml`, inspectați cele două URL-uri și solicitați indexarea. Indexarea și pozițiile nu sunt garantate și pot necesita timp.
7. Creați sau revendicați profilul real Google Business Profile al salonului. Numele, adresa, telefonul, serviciile și programul trebuie să coincidă cu site-ul. Adăugați fotografii autentice și solicitați recenzii sincere, fără recompense sau recenzii fabricate.
8. Confirmați programul folosit din site: luni–vineri 09:00–20:00, sâmbătă–duminică 09:00–16:00. Dacă nu este corect, actualizați simultan footer-ul, datele structurate și profilul Google.
9. Testați pagina principală în Rich Results Test și PageSpeed Insights după lansare. Verificarea locală a sintaxei JSON nu înlocuiește aceste teste live.

## Fișiere de publicat pentru această actualizare

`index.html`, `membership.html`, `dashboard.html`, `visual-polish.css`, `sw.js`, `robots.txt`, `sitemap.xml`. Păstrați toate celelalte fișiere și imagini ale aplicației.

## Dezvoltare ulterioară

Următoarea extindere utilă: pagini separate cu conținut original pentru masaj, pedichiură medicală, fitness și îngrijirea unghiilor, legate din navigare. Nu folosiți pagini aproape identice pentru fiecare localitate. Măsurați în Search Console căutările și paginile care atrag clienți înainte de a extinde conținutul.

Referințe: https://developers.google.com/search/docs/fundamentals/seo-starter-guide și https://developers.google.com/search/docs/appearance/structured-data/local-business
