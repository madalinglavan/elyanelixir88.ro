# Elyan Atelier — actualizare 18 septembrie 2026

Remodelare locală, fără publicare și fără integrare server sau Stripe.

## Ce s-a schimbat

- Aspect comun verde profund, auriu cald și suprafețe crem.
- Prima pagină cu două acțiuni clare: descoperirea serviciilor și programare.
- Prezentare vizuală a celor patru categorii; butonul Servicii din bara de jos duce la această prezentare.
- Zona Membership explică regulile reale: minimum 3 ședințe eligibile, reducere 15%, Fitness separat la 60 Lei/lună.
- Servicii compacte în două coloane pe desktop, una pe mobil; detaliile sunt la cerere.
- Configurator cu pași expliciți, număr de selecții pe categorie și evidențierea rândurilor alese.
- Protecție de focus în fereastra cardului pentru navigarea cu tastatura.
- Dashboard stilizat în aceeași direcție și textul vechi despre înregistrarea descărcărilor corectat.

## Fișiere pentru publicare

Încarcă împreună: index.html, membership.html, dashboard.html, mobile-app.js,
atelier.css, atelier.js și sw.js. Păstrează și toate fișierele și imaginile existente.

## Verificări

- Layouturi verificate în browser la 390 px și 1440 px, fără depășire orizontală în paginile testate.
- 3 × 69 Lei: subtotal 207 Lei, reducere 31,05 Lei, total 175,95 Lei.
- Cardul pentru 14 octombrie 2026 este valabil până la 14 noiembrie 2026 inclusiv.
- Testele existente pentru workflow și SEO au trecut.
- Nu au fost trimise mesaje WhatsApp și nu au fost înregistrate solicitări de test.

## Limite păstrate

Dashboard-ul și protecția împotriva duplicatelor sunt locale browserului.
Autentificarea în JavaScript nu înlocuiește securitatea pe server. Livrarea WhatsApp
și plata nu pot fi confirmate automat de acest site. Acestea rămân pentru etapa
de hosting, bază de date și integrare de plată.
