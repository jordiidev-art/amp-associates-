/* =========================================================
   GMP & ASSOCIATES
   MASTER JAVASCRIPT
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const body = document.body;

  const loader = document.getElementById("loader");
  const header = document.getElementById("header");
  const scrollProgress =
    document.getElementById("scrollProgress");

  const menuButton =
    document.getElementById("menuButton");

  const mobileNav =
    document.getElementById("mobileNav");

  const mobileLinks =
    document.querySelectorAll(".mobile-nav a");

  const revealElements =
    document.querySelectorAll(".reveal");

  const parallaxElements =
    document.querySelectorAll("[data-parallax]");

  const teamCards =
    document.querySelectorAll(".team-card");


  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =========================================================
     INITIAL LOADING STATE
     ========================================================= */

  body.classList.add("loading");

  if (header) {
    header.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  /* =========================================================
     LOADER
     ========================================================= */

  let loaderHidden = false;

  function hideLoader() {

    if (loaderHidden) {
      return;
    }

    loaderHidden = true;

    if (loader) {

      loader.classList.add("hidden");

      loader.setAttribute(
        "aria-hidden",
        "true"
      );

    }

    body.classList.remove("loading");

    if (header) {

      header.removeAttribute(
        "aria-hidden"
      );

    }

    updateScroll();
  }


  if (reducedMotion) {

    setTimeout(
      hideLoader,
      150
    );

  } else {

    window.addEventListener(
      "load",
      () => {

        setTimeout(
          hideLoader,
          1800
        );

      },
      {
        once: true
      }
    );


    setTimeout(
      hideLoader,
      4000
    );

  }


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  let menuOpen = false;


  function setMenu(open) {

    if (!menuButton || !mobileNav) {
      return;
    }

    menuOpen = open;

    menuButton.classList.toggle(
      "active",
      open
    );

    mobileNav.classList.toggle(
      "active",
      open
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );

    mobileNav.setAttribute(
      "aria-hidden",
      String(!open)
    );

    body.style.overflow =
      open ? "hidden" : "";

  }


  if (menuButton) {

    menuButton.addEventListener(
      "click",
      () => {

        setMenu(
          !menuOpen
        );

      }
    );

  }


  mobileLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          setMenu(false);

        }
      );

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        menuOpen
      ) {

        setMenu(false);

      }

    }
  );


  /* =========================================================
     REVEAL ON SCROLL
     ========================================================= */

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "visible"
        );

      }
    );

  } else {

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                obs.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -50px 0px"
        }
      );


    revealElements.forEach(
      (element) => {

        observer.observe(
          element
        );

      }
    );

  }


  /* =========================================================
     SCROLL PROGRESS
     + HEADER STATE
     + PARALLAX
     ========================================================= */

  let scrollTicking = false;


  function updateScroll() {

    const scrollTop =
      window.scrollY ||
      window.pageYOffset ||
      0;


    const documentHeight =
      document.documentElement.scrollHeight;


    const viewportHeight =
      window.innerHeight;


    const availableHeight =
      documentHeight -
      viewportHeight;


    /* -------------------------------------------------------
       SCROLL PROGRESS
       ------------------------------------------------------- */

    if (scrollProgress) {

      const progress =
        availableHeight > 0
          ? scrollTop / availableHeight
          : 0;


      const clampedProgress =
        Math.min(
          Math.max(
            progress,
            0
          ),
          1
        );


      scrollProgress.style.transform =
        `scaleX(${clampedProgress})`;

    }


    /* -------------------------------------------------------
       HEADER SCROLL EFFECT
       ------------------------------------------------------- */

    if (header) {

      header.classList.toggle(
        "scrolled",
        scrollTop > 25
      );

    }


    /* -------------------------------------------------------
       PARALLAX
       ------------------------------------------------------- */

    if (
      !reducedMotion &&
      window.innerWidth > 900
    ) {

      parallaxElements.forEach(
        (element) => {

          const speed =
            parseFloat(
              element.dataset.parallax
            ) || 0;


          const rect =
            element.getBoundingClientRect();


          if (
            rect.bottom > 0 &&
            rect.top <
              window.innerHeight
          ) {

            const distance =
              rect.top -
              window.innerHeight / 2;


            element.style.transform =
              `translate3d(
                0,
                ${distance * speed}px,
                0
              )`;

          }

        }
      );

    }


    scrollTicking = false;

  }


  window.addEventListener(
    "scroll",
    () => {

      if (!scrollTicking) {

        window.requestAnimationFrame(
          updateScroll
        );

        scrollTicking = true;

      }

    },
    {
      passive: true
    }
  );


  updateScroll();


  /* =========================================================
     TEAM CARDS — MOBILE
     ========================================================= */

  const coarsePointer =
    window.matchMedia(
      "(pointer: coarse)"
    ).matches;


  if (coarsePointer) {

    teamCards.forEach(
      (card) => {

        card.addEventListener(
          "click",
          () => {

            const wasExpanded =
              card.classList.contains(
                "expanded"
              );


            teamCards.forEach(
              (otherCard) => {

                otherCard.classList.remove(
                  "expanded"
                );

              }
            );


            if (!wasExpanded) {

              card.classList.add(
                "expanded"
              );

            }

          }
        );

      }
    );

  }


  /* =========================================================
     SMOOTH INTERNAL LINKS
     ========================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          (event) => {

            const targetId =
              link.getAttribute(
                "href"
              );


            if (
              !targetId ||
              targetId === "#"
            ) {

              return;

            }


            let target = null;

            try {

              target =
                document.querySelector(
                  targetId
                );

            } catch (error) {

              return;

            }


            if (!target) {
              return;
            }


            event.preventDefault();


            const headerHeight =
              header
                ? header.offsetHeight
                : 0;


            const targetPosition =
              target
                .getBoundingClientRect()
                .top +
              window.scrollY -
              headerHeight -
              10;


            window.scrollTo({

              top:
                targetPosition,

              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth"

            });

          }
        );

      }
    );


  /* =========================================================
     SERVICES → CONTACT
     ========================================================= */

  const contactSection =
    document.querySelector(
      "#contact"
    );


  if (contactSection) {

    const serviceItems =
      document.querySelectorAll(
        `
        .service-item,
        .service-row,
        .service-card,
        .services-item,
        .service,
        .hero-index > div
        `
      );


    serviceItems.forEach(
      (item) => {

        item.style.cursor =
          "pointer";


        item.addEventListener(
          "click",
          () => {

            const headerHeight =
              header
                ? header.offsetHeight
                : 0;


            const targetPosition =
              contactSection
                .getBoundingClientRect()
                .top +
              window.scrollY -
              headerHeight -
              10;


            window.scrollTo({

              top:
                targetPosition,

              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth"

            });

          }
        );

      }
    );

  }


  /* =========================================================
     HEADER LOGOS → BACK TO TOP
     ========================================================= */

  document
    .querySelectorAll(
      ".brand-ca, .brand-gmp, .header-ca-logo, .header-gmp-logo"
    )
    .forEach(
      (logo) => {

        logo.style.cursor =
          "pointer";


        logo.addEventListener(
          "click",
          (event) => {

            event.preventDefault();


            window.scrollTo({

              top: 0,

              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth"

            });

          }
        );

      }
    );


  /* =========================================================
     RESIZE SAFETY
     ========================================================= */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            if (
              window.innerWidth > 850 &&
              menuOpen
            ) {

              setMenu(false);

            }


            updateScroll();

          },
          150
        );

    }
  );


  /* =========================================================
     IMAGE FALLBACK
     ========================================================= */

  document
    .querySelectorAll("img")
    .forEach(
      (image) => {

        image.addEventListener(
          "error",
          () => {

            image.classList.add(
              "image-error"
            );


            image.alt =
              image.alt ||
              "GMP & Associates";

          }
        );

      }
    );


  /* =========================================================
     PAGE VISIBILITY SAFETY
     ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        updateScroll();

      }

    }
  );

});