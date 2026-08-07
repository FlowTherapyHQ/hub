"use strict";

/* =========================================================
   FLOWHUB CMS
   ARTICLE PAGE UTILITIES
   Version 2.0
   ========================================================= */

window.FlowHub = window.FlowHub || {};

/* =========================================================
   Escape text before inserting it into HTML
   ========================================================= */

FlowHub.escapeHTML = function (value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

/* =========================================================
   Format publication date
   ========================================================= */

FlowHub.formatArticleDate = function (dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

/* =========================================================
   Find current article ID

   Preferred method:
   Add data-article-id to the <body> element.

   Example:
   <body data-article-id="patellofemoral-pain-syndrome">
   ========================================================= */

FlowHub.getCurrentArticleId = function () {
  const bodyId = document.body?.dataset?.articleId;

  if (bodyId) {
    return bodyId.trim();
  }

  const fileName = window.location.pathname
    .split("/")
    .pop()
    .replace(/\.html?$/i, "");

  return decodeURIComponent(fileName);
};

/* =========================================================
   Get article navigation

   Articles are ordered newest to oldest.
   ========================================================= */

FlowHub.getArticleNavigation = function (articleId) {
  const orderedArticles = [...FlowHub.articles].sort(
    (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
  );

  const currentIndex = orderedArticles.findIndex(
    (article) => article.id === articleId
  );

  if (currentIndex === -1) {
    return {
      previous: null,
      next: null,
    };
  }

  return {
    previous: orderedArticles[currentIndex + 1] || null,
    next: orderedArticles[currentIndex - 1] || null,
  };
};

/* =========================================================
   Create article metadata
   ========================================================= */

FlowHub.createArticleMetaHTML = function (article) {
  const date = FlowHub.escapeHTML(
    FlowHub.formatArticleDate(article.publishDate)
  );

  const readTime = FlowHub.escapeHTML(article.readTime || "");

  return `
    <span>By Brandy Hennigan, LMT</span>

    <span aria-hidden="true">•</span>

    <span>${date}</span>

    ${
      readTime
        ? `
          <span aria-hidden="true">•</span>
          <span>${readTime}</span>
        `
        : ""
    }
  `;
};

/* =========================================================
   Create related article cards
   ========================================================= */

FlowHub.createRelatedArticlesHTML = function (articles) {
  if (!articles.length) {
    return "";
  }

  const cards = articles
    .map((article) => {
      const title = FlowHub.escapeHTML(article.title);
      const category = FlowHub.escapeHTML(article.category);
      const excerpt = FlowHub.escapeHTML(article.excerpt);
      const url = FlowHub.escapeHTML(article.url);

      return `
        <article class="flowhub-related-card">
          ${
            category
              ? `
                <p class="flowhub-related-category">
                  ${category}
                </p>
              `
              : ""
          }

          <h3 class="flowhub-related-title">
            <a href="${url}">
              ${title}
            </a>
          </h3>

          ${
            excerpt
              ? `
                <p class="flowhub-related-excerpt">
                  ${excerpt}
                </p>
              `
              : ""
          }

          <a
            class="flowhub-related-link"
            href="${url}"
            aria-label="Read ${title}"
          >
            Read FlowNote
          </a>
        </article>
      `;
    })
    .join("");

  return `
    <section
      class="flowhub-related-section"
      aria-labelledby="flowhub-related-heading"
    >
      <div class="flowhub-related-heading-row">
        <div>
          <p class="flowhub-related-eyebrow">Continue Learning</p>

          <h2 id="flowhub-related-heading">
            Related FlowNotes
          </h2>
        </div>

        <a
          class="flowhub-related-library-link"
          href="/pages/flownotes.html"
        >
          Browse All FlowNotes
        </a>
      </div>

      <div class="flowhub-related-grid">
        ${cards}
      </div>
    </section>
  `;
};

/* =========================================================
   Create previous / next navigation
   ========================================================= */

FlowHub.createArticleNavigationHTML = function (articleId) {
  const navigation = FlowHub.getArticleNavigation(articleId);

  if (!navigation.previous && !navigation.next) {
    return "";
  }

  const previousHTML = navigation.previous
    ? `
      <a class="flownote-nav-card flownote-nav-previous"
         href="${FlowHub.escapeHTML(navigation.previous.url)}">

        <span class="flownote-nav-label">
          ← Previous FlowNote
        </span>

        <span class="flownote-nav-title">
          ${FlowHub.escapeHTML(navigation.previous.title)}
        </span>

      </a>
    `
    : `<div class="flownote-nav-placeholder"></div>`;

  const nextHTML = navigation.next
    ? `
      <a class="flownote-nav-card flownote-nav-next"
         href="${FlowHub.escapeHTML(navigation.next.url)}">

        <span class="flownote-nav-label">
          Next FlowNote →
        </span>

        <span class="flownote-nav-title">
          ${FlowHub.escapeHTML(navigation.next.title)}
        </span>

      </a>
    `
    : `<div class="flownote-nav-placeholder"></div>`;

  return `
    <nav
      class="flownote-navigation"
      aria-label="Previous and Next FlowNotes">

      ${previousHTML}

      ${nextHTML}

    </nav>
  `;
};

/* =========================================================
   Insert metadata
   ========================================================= */

FlowHub.renderArticleMeta = function (article) {
  const target = document.getElementById("flowhub-article-meta");

  if (!target) {
    return;
  }

  target.innerHTML = FlowHub.createArticleMetaHTML(article);
};

/* =========================================================
   Insert related articles
   ========================================================= */

FlowHub.renderRelatedArticles = function (articleId) {
  const target = document.getElementById("flowhub-related-articles");

  if (!target) {
    return;
  }

  const relatedArticles = FlowHub.getRelatedArticles(articleId, 3);

  target.innerHTML =
    FlowHub.createRelatedArticlesHTML(relatedArticles);
};

/* =========================================================
   Insert previous / next navigation
   ========================================================= */

FlowHub.renderArticleNavigation = function (articleId) {
  const target = document.getElementById("flowhub-article-navigation");

  if (!target) {
    return;
  }

  target.innerHTML =
    FlowHub.createArticleNavigationHTML(articleId);
};

FlowHub.renderArticleReadTime = function (article) {
  const target = document.querySelector("[data-article-read-time]");

  if (!target || !article || !article.readTime) {
    return;
  }

  target.textContent = article.readTime;
};

/* =========================================================
   Initialize article utilities
   ========================================================= */

FlowHub.initArticle = function (articleId) {
  const resolvedId =
    articleId || FlowHub.getCurrentArticleId();

  const article = FlowHub.getArticle(resolvedId);

  if (!article) {
    console.warn(
      `FlowHub: Article "${resolvedId}" was not found in content-registry.js.`
    );

    return;
  }

  FlowHub.renderArticleMeta(article);
  FlowHub.renderArticleReadTime(article);
  FlowHub.renderRelatedArticles(resolvedId);
  FlowHub.renderArticleNavigation(resolvedId);
};

/* =========================================================
   Automatically initialize after page load
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  FlowHub.initArticle();
});