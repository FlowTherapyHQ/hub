"use strict";

/* =========================================================
   FLOWHUB SHARED HEADER AND FOOTER
   ========================================================= */

(function () {
  const currentPath = window.location.pathname.toLowerCase();

  function getActiveSection() {
    if (
      currentPath === "/" ||
      currentPath.endsWith("/index.html")
    ) {
      return "home";
    }

    if (currentPath.includes("/forms.html")) {
      return "forms";
    }

    if (currentPath.includes("/aftercare.html")) {
      return "aftercare";
    }
if (currentPath.includes("/body-map.html")) {
  return "flowmap";
}
    /*
      Individual FlowNotes articles and category pages
      will highlight FlowNotes.
    */
    if (
      currentPath.includes("/flownotes.html") ||
      currentPath.includes("/articles/") ||
      currentPath.includes("/categories/")
    ) {
      return "flownotes";
    }

    if (
      currentPath.includes("/flowresources-redesign.html") ||
      currentPath.includes("/flowresources-backup.html")
    ) {
      return "flowresources";
    }

    /*
      Specialized program pages will highlight
      Wellness Programs.
    */
    if (
      currentPath.includes("/wellness-programs.html") ||
      currentPath.includes("/flowpass.html") ||
      currentPath.includes("/spaflow.html") ||
      currentPath.includes("/veterans.html") ||
      currentPath.includes("/corporate.html")
    ) {
      return "programs";
    }

    if (currentPath.includes("/faq.html")) {
      return "faq";
    }

    /*
      Contact, inquiry, and confirmation pages
      will highlight Contact FlowTherapy.
    */
    if (
      currentPath.includes("/contact.html") ||
      currentPath.includes("/inquiry.html") ||
      currentPath.includes("/thank-you.html")
    ) {
      return "contact";
    }

    return "";
  }

  const activeSection = getActiveSection();

  function activeClass(sectionName) {
    return activeSection === sectionName ? ' class="active"' : "";
  }

  const headerHTML = `
    <header class="header">
      <div class="logo">
        <a href="/index.html" aria-label="Return to the FlowHub homepage">
          <img
            src="/assets/images/flowhub-horizontal.png"
            alt="FlowHub wellness portal logo"
            title="FlowHub"
          />
        </a>
      </div>

      <div class="subtitle">Your Wellness Portal</div>

      <nav class="nav" aria-label="Main navigation">
        <a href="/index.html"${activeClass("home")}>Home</a>

        <a href="/pages/forms.html"${activeClass("forms")}>
          Forms
        </a>

        <a href="/pages/aftercare.html"${activeClass("aftercare")}>
       Aftercare
      </a>

      <a href="/pages/body-map.html"${activeClass("flowmap")}>
      FlowMap
      </a>

      <a href="/pages/flownotes.html"${activeClass("flownotes")}>
       FlowNotes
        </a>

        <a
          href="/pages/flowresources-redesign.html"
          ${activeClass("flowresources")}
        >
          FlowResources
        </a>

        <a
          href="/pages/wellness-programs.html"
          ${activeClass("programs")}
        >
          Wellness Programs
        </a>

        <a href="/pages/faq.html"${activeClass("faq")}>
          FAQ
        </a>

        <a href="/pages/contact.html"${activeClass("contact")}>
          Contact FlowTherapy
        </a>
      </nav>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="/index.html"${activeClass("home")}>Home</a>

        <a href="/pages/forms.html"${activeClass("forms")}>
          Forms
        </a>

        <a href="/pages/aftercare.html"${activeClass("aftercare")}>
          Aftercare
        </a>
        <a href="/pages/body-map.html">FlowMap</a>

        <a href="/pages/flownotes.html"${activeClass("flownotes")}>
          FlowNotes
        </a>

        <a
          href="/pages/flowresources-redesign.html"
          ${activeClass("flowresources")}
        >
          FlowResources
        </a>

        <a
          href="/pages/wellness-programs.html"
          ${activeClass("programs")}
        >
          Wellness Programs
        </a>

        <a href="/pages/faq.html"${activeClass("faq")}>
          FAQ
        </a>

        <a href="/pages/contact.html"${activeClass("contact")}>
          Contact FlowTherapy
        </a>
      </nav>

      <p>
        &copy; FlowTherapy • Move Better. Feel Better. Live Better.
      </p>
    </footer>
  `;

  function insertSharedLayout() {
    const headerTarget = document.getElementById("site-header");
    const footerTarget = document.getElementById("site-footer");

    if (headerTarget) {
      headerTarget.innerHTML = headerHTML;
    }

    if (footerTarget) {
      footerTarget.innerHTML = footerHTML;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertSharedLayout);
  } else {
    insertSharedLayout();
  }
  /* ===================================================
   MOBILE BODY-AREA SHORTCUT
   =================================================== */

const mobileBodyAreaButton = document.getElementById(
  "mobile-body-area-button",
);

const allBodyAreasSection = document.getElementById(
  "all-body-areas",
);

if (mobileBodyAreaButton && allBodyAreasSection) {
  mobileBodyAreaButton.addEventListener("click", () => {
    allBodyAreasSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  const bodyAreaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        mobileBodyAreaButton.classList.toggle(
          "is-hidden",
          entry.isIntersecting,
        );
      });
    },
    {
      threshold: 0.15,
    },
  );

  bodyAreaObserver.observe(allBodyAreasSection);
}
})();