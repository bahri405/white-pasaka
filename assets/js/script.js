AOS.init({ duration: 1000, once: true });
// 1. Inisialisasi Smooth Scroll (Lenis)
// script.js — consolidated initializations and short comments
(function () {
    // AOS: animate elements when they scroll into view (if AOS is loaded)
    if (window.AOS && typeof AOS.init === "function") {
        AOS.init({ duration: 1000, once: false, mirror: true });
    }

    // Lenis: smooth-scrolling engine. Starts a RAF loop to update physics.
    // Guarded so file works even if Lenis is not included.
    if (window.Lenis) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Parallax background: updates transform on scroll using requestAnimationFrame
    // for better performance and to avoid layout thrashing.
    const parallaxBg = document.getElementById("parallax-bg");
    if (parallaxBg) {
        let latestOffset = 0;
        let ticking = false;
        window.addEventListener(
            "scroll",
            () => {
                latestOffset = window.pageYOffset;
                if (!ticking) {
                    requestAnimationFrame(() => {
                        parallaxBg.style.transform = `translate3d(0, ${latestOffset * 0.3}px, 0)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true },
        );
    }

    // DOMContentLoaded: initialize components that need DOM elements present
    document.addEventListener("DOMContentLoaded", () => {
        // Swiper: carousel/hero slider (if Swiper loaded)
        if (window.Swiper) {
            new Swiper(".mySwiper", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                parallax: true,
                speed: 1200,
                autoplay: { delay: 6000, disableOnInteraction: false },
                navigation: { nextEl: ".swiper-next-btn", prevEl: ".swiper-prev-btn" },
            });
        }

        // Mobile menu: toggles hamburger animation and page scroll lock
        const menuBtn = document.getElementById("menuBtn");
        const mobileMenu = document.getElementById("mobileMenu");
        const line1 = document.getElementById("line1");
        const line2 = document.getElementById("line2");
        const line3 = document.getElementById("line3");
        let isMenuOpen = false;

        if (menuBtn) {
            menuBtn.addEventListener("click", () => {
                isMenuOpen = !isMenuOpen;
                if (line1) {
                    line1.classList.toggle("rotate-45", isMenuOpen);
                    line1.classList.toggle("translate-x-[2px]", isMenuOpen);
                    line1.classList.toggle("translate-y-[-1px]", isMenuOpen);
                }
                if (line2) line2.classList.toggle("opacity-0", isMenuOpen);
                if (line3) {
                    line3.classList.toggle("-rotate-45", isMenuOpen);
                    line3.classList.toggle("translate-x-[2px]", isMenuOpen);
                    line3.classList.toggle("translate-y-[1px]", isMenuOpen);
                }
                if (mobileMenu)
                    mobileMenu.classList.toggle("translate-x-full", !isMenuOpen);
                document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
            });
        }

        // lucide: replace <i> placeholders with SVG icons (if library present)
        if (window.lucide && typeof lucide.createIcons === "function")
            lucide.createIcons();

        // Reveal elements: add 'active' class when element becomes visible
        const revealEls = document.querySelectorAll(".reveal");
        if (revealEls.length > 0 && "IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) entry.target.classList.add("active");
                    });
                },
                { threshold: 0.1 },
            );
            revealEls.forEach((el) => observer.observe(el));
        }
    });
})();
mobileMenu.classList.add("translate-x-full");

// Buka scroll body
document.body.style.overflow = "auto";
lucide.createIcons();
