/*==================================================

    ELYAN ELIXIR
    script.js

==================================================*/


/*==================================================

    SELECTORS

==================================================*/
const loader = document.getElementById("loader");
const header = document.querySelector("header");
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");
const navigationLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");
const sections = document.querySelectorAll("section");

// Eliminăm complet din interfață vechile servicii Fitness care nu sunt oferite.
document.querySelectorAll('#fitness .service-card[hidden][data-category="fitness"], a[hidden][href^="#fitness-"]').forEach(element=>element.remove());
document.querySelectorAll('.nav-links li[hidden]').forEach(element=>element.remove());
/*==================================================

    WINDOW LOAD

==================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 550);

});




function handleScroll() {

    const scrollY = window.scrollY;

    if (scrollY > 60) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");
    }

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (scrollY >= sectionTop) {
            current = section.id;
        }

    });

    navigationLinks.forEach(link => {

        link.classList.remove("current");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("current");
        }

    });

    if (backToTop) {
        backToTop.classList.toggle("active", scrollY > 500);
    }

}
window.addEventListener("scroll", handleScroll);


/* =========================================================
   PAGE NAVIGATION TRANSITION
========================================================= */
/* =========================================================
   PAGE NAVIGATION TRANSITION
========================================================= */

function initPageNavigationTransition() {

    const transition =
        document.querySelector(".page-transition");

    if (!transition) return;

    /*
       Include:
       - logo-ul principal;
       - navigatorul desktop;
       - navigatorul mobil.
    */

    const navigationLinks =
        document.querySelectorAll(
            '.logo[href^="#"], ' +
            '.nav-links a[href^="#"], ' +
            '.mobile-menu a[href^="#"]'
        );

    navigationLinks.forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            /* ÎNCHIDEM MENIUL MOBIL */

            burger?.classList.remove("active");
            mobileMenu?.classList.remove("active");
            overlay?.classList.remove("active");
            document.body.classList.remove("menu-open");
            burger?.setAttribute("aria-expanded", "false");
            mobileMenu?.setAttribute("aria-hidden", "true");

            /* POZIȚIA SECȚIUNII */

            const headerOffset = 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            const finalPosition =
                Math.max(targetPosition, 0);

            /* DISTANȚA PÂNĂ LA SECȚIUNE */

            const distance =
                Math.abs(finalPosition - window.scrollY);

            /* TIMP DINAMIC */

            const transitionDuration =
                Math.min(
                    Math.max(distance / 3, 700),
                    1500
                );

            /* AFIȘĂM TRANZIȚIA */

            transition.classList.add("active");

            transition.setAttribute(
                "aria-hidden",
                "false"
            );

            /* DERULĂM PAGINA */

            setTimeout(() => {

                window.scrollTo({
                    top: finalPosition,
                    behavior: "smooth"
                });

            }, 200);

            /* ASCUNDEM TRANZIȚIA */

            setTimeout(() => {

                transition.classList.remove("active");

                transition.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }, transitionDuration);

            /* ACTUALIZĂM URL-UL */

            history.pushState(
                null,
                "",
                href
            );

        });

    });

}


document.addEventListener(
    "DOMContentLoaded",
    initPageNavigationTransition
);






/*==================================================

    SCROLL INDICATOR

==================================================*/

const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {

    scrollIndicator.addEventListener("click", () => {

        const nextSection = document.querySelector("#massage");

        if (nextSection) {

            nextSection.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

}




/*==================================================

    CLICK OUTSIDE MENU

==================================================*/

document.addEventListener("click", (e) => {

    if (!mobileMenu || !burger || !overlay) return;

    const insideMenu = mobileMenu.contains(e.target);

    const insideBurger = burger.contains(e.target);

    if (!insideMenu && !insideBurger) {

        burger.classList.remove("active");

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

        overlay.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");

    }

});



/*==================================================

    RESIZE WINDOW

==================================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

        burger.classList.remove("active");

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");
        overlay.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");

    }

});





/*==================================================

    HERO SLIDER

==================================================*/

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index) {

    slides.forEach((slide) => {

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

}

function nextSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}

if (slides.length > 0) {

    setInterval(nextSlide, 10000);

}





/*==================================================

    SCROLL TO TOP BUTTON

==================================================*/

const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    if (window.scrollY > 500) {

        backToTop.classList.add("active");

    }

    else {

        backToTop.classList.remove("active");

    }

});

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}



/*==================================================

    HERO BUTTON HOVER EFFECT

==================================================*/

const heroButtons = document.querySelectorAll(

    ".btn-primary, .btn-secondary"

);

heroButtons.forEach((button) => {

    button.addEventListener("mouseenter", () => {

        button.classList.add("hover");

    });

    button.addEventListener("mouseleave", () => {

        button.classList.remove("hover");

    });

});






/*==================================================

    LAZY LOAD IMAGES

==================================================*/

const lazyImages = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver(

    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const img = entry.target;

            img.src = img.dataset.src;

            img.removeAttribute("data-src");

            observer.unobserve(img);

        });

    },

    {

        threshold: 0.1

    }

);

lazyImages.forEach((img) => {

    imageObserver.observe(img);

});



/*==================================================

    PAGE FADE IN

==================================================*/

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});



/*==================================================

    CONSOLE MESSAGE

==================================================*/

console.log(

    "%cElyan Elixir",

    "color:#0F6A4D;font-size:22px;font-weight:bold;"

);

console.log(

    "%cWebsite realizat cu ❤️",

    "color:#D4AF37;font-size:14px;"

);






overlay?.addEventListener("click",()=>{

    burger.classList.remove("active");

    mobileMenu.classList.remove("active");

    overlay.classList.remove("active");

    document.body.classList.remove("menu-open");

    burger?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");

});

/*==================================================

FULLSCREEN MENU

==================================================*/



if (burger) {

    burger.addEventListener("click", () => {

        burger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
        const isOpen = mobileMenu.classList.contains("active");
        burger.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));

    });

}


document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

burger?.classList.remove("active");

mobileMenu?.classList.remove("active");

document.body.classList.remove("menu-open");

overlay?.classList.remove("active");
burger?.setAttribute("aria-expanded", "false");
mobileMenu?.setAttribute("aria-hidden", "true");

}

});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");
            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px"
});

reveals.forEach(el => observer.observe(el));



document.querySelectorAll(".mobile-dropdown-btn").forEach(button => {

    button.addEventListener("click", function(){

        const current = this.parentElement;

        document.querySelectorAll(".mobile-dropdown").forEach(item => {

            if(item !== current){
                item.classList.remove("active");
                item.querySelector(".mobile-dropdown-btn")?.setAttribute("aria-expanded", "false");
            }

        });

        current.classList.toggle("active");
        this.setAttribute("aria-expanded", String(current.classList.contains("active")));

    });

});



/*==========================================
DESKTOP DROPDOWN DELAY
==========================================*/

document.querySelectorAll(".dropdown").forEach(dropdown => {

    let timeout;

    dropdown.addEventListener("mouseenter", () => {

        clearTimeout(timeout);

        dropdown.classList.add("active");

    });

    dropdown.addEventListener("mouseleave", () => {

        timeout = setTimeout(() => {

            dropdown.classList.remove("active");

        }, 300); // timpul în ms

    });

});



/*==================================================

    SERVICES SYSTEM

==================================================*/

initServices();

function initServices() {

    document.querySelectorAll(".service-card").forEach(initServiceCard);

}
function initServiceCard(card) {

    const category = card.dataset.category;
    const service = card.dataset.service;

    const data = window.services?.[category]?.[service];

    if (!data) {

        console.warn(`Serviciul ${category}.${service} nu există.`);
        return;

    }

    renderOptions(card, data);

    const firstBlock = card.querySelector(".service-block");
    if (firstBlock && !card.querySelector(".service-details-toggle")) {
        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "service-details-toggle";
        detailsButton.setAttribute("aria-expanded", "false");
        detailsButton.innerHTML = `<span>Descoperă experiența</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
        firstBlock.before(detailsButton);

        detailsButton.addEventListener("click", () => {
            const isOpen = card.classList.toggle("details-open");
            detailsButton.setAttribute("aria-expanded", String(isOpen));
            detailsButton.querySelector("span").textContent = isOpen ? "Ascunde detaliile" : "Descoperă experiența";
        });
    }

}

function renderOptions(card, data) {

    const selector = card.querySelector(".duration-selector");
    const priceElement = card.querySelector(".price-value");
    const button = card.querySelector(".service-btn");

    if (!selector || !priceElement || !button) return;

    selector.innerHTML = "";
    selector.setAttribute("role", "group");
    selector.setAttribute("aria-label", "Alege durata și tipul experienței");
    priceElement.setAttribute("aria-live", "polite");

    let defaultIndex =
        data.options.findIndex(option => option.recommended);

    if (defaultIndex === -1) defaultIndex = 0;

    data.options.forEach((option, index) => {

        const durationCard = document.createElement("button");

        durationCard.type = "button";
        durationCard.className = "duration-card";
        durationCard.setAttribute("aria-pressed", String(index === defaultIndex));

        if (index === defaultIndex) {
            durationCard.classList.add("active");
        }

        durationCard.innerHTML = `

            ${option.duration
                ? `<span>${option.duration} min</span>`
                : ""}

            <strong>${option.label}</strong>

            ${option.badge
                ? `<small>${option.badge}</small>`
                : ""}

        `;

        durationCard.addEventListener("click", () => {

            selector
                .querySelectorAll(".duration-card")
                .forEach(btn => {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-pressed", "false");
                });

            durationCard.classList.add("active");
            durationCard.setAttribute("aria-pressed", "true");

            updateSelection(
                data,
                option,
                priceElement,
                button
            );

        });

        selector.appendChild(durationCard);

    });

    updateSelection(
        data,
        data.options[defaultIndex],
        priceElement,
        button
    );

    if (data.options.length === 1) {

    selector.innerHTML = `
        <div class="service-fixed-option">
            <i class="fa-solid fa-circle-check"></i>
            <span>${data.options[0].label}</span>
        </div>
    `;

    updateSelection(
        data,
        data.options[0],
        priceElement,
        button
    );

    return;
}

}
function updateSelection(
    data,
    option,
    priceElement,
    button
) {

    priceElement.textContent =
        option.price + " Lei";

    const durationSection = option.duration
        ? `Durată: ${option.duration} minute`
        : null;

    const messageLines = option.whatsappSubscription ? [
        "Bună ziua!",
        "Doresc să achiziționez abonamentul lunar Fitness Elyan Elixir 88.",
        "Am înțeles că accesul la aparate este autonom și nu include antrenor personal.",
        `Preț abonament: *${option.price} Lei/lună*`,
        "Îmi puteți confirma disponibilitatea și detaliile pentru activare?",
        "Mulțumesc!"
    ] : [
        "Bună ziua!",
        "Doresc o programare pentru:",
        `*${data.title}*`,
        `Experiență: *${option.label}*`,
        durationSection,
        `Preț: *${option.price} Lei*`,
        "Îmi puteți spune când aveți locuri disponibile?",
        "Mulțumesc!"
    ];

    const message = messageLines
        .filter(Boolean)
        .join("\n");

    button.href =
        "https://wa.me/40769729403?text=" +
        encodeURIComponent(message);
}

