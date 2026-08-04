"use strict";

/* =========================================================
   FLOWHUB CMS LITE — HOMEPAGE RENDERER
   ========================================================= */

(function () {
  function getNewestFeaturedItem(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    const featuredItems = items.filter(function (item) {
      return item.featured === true;
    });

    const availableItems =
      featuredItems.length > 0 ? featuredItems : items;

    return [...availableItems].sort(function (itemA, itemB) {
      return new Date(itemB.publishDate) - new Date(itemA.publishDate);
    })[0];
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element && value) {
      element.textContent = value;
    }
  }

  function setLink(selector, url) {
    const element = document.querySelector(selector);

    if (element && url) {
      element.href = url;
    }
  }

  function renderFeaturedFlowNote(flowNote) {
    if (!flowNote) {
      return;
    }

    setText("[data-cms='flownote-title']", flowNote.title);

    setText(
      "[data-cms='flownote-description']",
      flowNote.excerpt,
    );

    setLink("[data-cms='flownote-link']", flowNote.url);

    setLink("[data-cms='flownote-image-link']", flowNote.url);

    const image = document.querySelector(
      "[data-cms='flownote-image']",
    );

    if (image && flowNote.image) {
      image.src = flowNote.image;
      image.alt =
        flowNote.imageAlt ||
        `Preview for ${flowNote.title}`;
    }

    const imageLink = document.querySelector(
      "[data-cms='flownote-image-link']",
    );

    if (imageLink) {
      imageLink.setAttribute(
        "aria-label",
        `Read ${flowNote.title}`,
      );
    }
  }

  function renderFeaturedFlowResource(resource) {
    if (!resource) {
      return;
    }

    setText(
      "[data-cms='resource-category']",
      resource.category,
    );

    setText(
      "[data-cms='resource-preview-title']",
      resource.previewTitle,
    );

    setText(
      "[data-cms='resource-preview-subtitle']",
      resource.previewSubtitle,
    );

    setText(
      "[data-cms='resource-preview-note']",
      resource.previewNote,
    );

    setText("[data-cms='resource-title']", resource.title);

    setText(
      "[data-cms='resource-description']",
      resource.description,
    );

    setLink(
      "[data-cms='resource-preview-link']",
      resource.resourceUrl,
    );

    setLink(
      "[data-cms='resource-link']",
      resource.resourceUrl,
    );

    setLink(
      "[data-cms='resource-article-link']",
      resource.relatedArticleUrl,
    );

    const previewLink = document.querySelector(
      "[data-cms='resource-preview-link']",
    );

    if (previewLink) {
      previewLink.setAttribute(
        "aria-label",
        `Open ${resource.title}`,
      );
    }

    const relatedArticleLink = document.querySelector(
      "[data-cms='resource-article-link']",
    );

    if (
      relatedArticleLink &&
      !resource.relatedArticleUrl
    ) {
      relatedArticleLink.hidden = true;
    }
  }
function formatPublishDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRecentlyAdded(items, limit = 3) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items]
    .filter(function (item) {
      return item && item.title && item.url;
    })
    .sort(function (itemA, itemB) {
      return new Date(itemB.publishDate) - new Date(itemA.publishDate);
    })
    .slice(0, limit);
}

function renderRecentlyAdded(flowNotes) {
  const container = document.getElementById("recent-flownotes");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!flowNotes.length) {
    container.innerHTML = `
      <p class="recent-flownotes-empty">
        New FlowNotes will appear here as they are added.
      </p>
    `;

    return;
  }

  flowNotes.forEach(function (flowNote) {
    const article = document.createElement("article");
    article.className = "recent-flownote-card";

    const category = document.createElement("span");
    category.className = "recent-flownote-category";
    category.textContent = flowNote.category || "FlowNotes";

    const title = document.createElement("h3");
    title.textContent = flowNote.title;

    const meta = document.createElement("p");
meta.className = "recent-flownote-meta";

if (flowNote.publishDate) {
  const date = document.createElement("span");
  date.textContent = formatPublishDate(flowNote.publishDate);
  meta.appendChild(date);
}

if (flowNote.readTime) {
  if (meta.childNodes.length > 0) {
    meta.append(" • ");
  }

  const readTime = document.createElement("span");
  readTime.textContent = flowNote.readTime;
  meta.appendChild(readTime);
}

    const excerpt = document.createElement("p");
    excerpt.className = "recent-flownote-excerpt";
    excerpt.textContent =
      flowNote.excerpt || "Explore this FlowNote from FlowTherapy.";

    const link = document.createElement("a");
    link.className = "recent-flownote-link";
    link.href = flowNote.url;
    link.textContent = "Read FlowNote →";
    link.setAttribute("aria-label", `Read ${flowNote.title}`);

    article.appendChild(category);
    article.appendChild(title);

    if (meta.children.length > 0) {
      article.appendChild(meta);
    }

    article.appendChild(excerpt);
    article.appendChild(link);

    container.appendChild(article);
  });
}
  function initializeHomepageCMS() {
    const cms = window.FlowHubCMS;

    if (!cms) {
      console.warn(
        "FlowHub CMS registry was not available. Homepage fallback content remains visible.",
      );

      return;
    }

    const featuredFlowNote = getNewestFeaturedItem(
      cms.flowNotes,
    );

    const featuredFlowResource = getNewestFeaturedItem(
      cms.flowResources,
    );

    renderFeaturedFlowNote(featuredFlowNote);

renderFeaturedFlowResource(featuredFlowResource);

const recentlyAddedFlowNotes = getRecentlyAdded(
  cms.flowNotes,
  3,
);

renderRecentlyAdded(recentlyAddedFlowNotes);

console.log(
  `FlowHub CMS Lite ${cms.version} loaded.`,
);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeHomepageCMS,
    );
  } else {
    initializeHomepageCMS();
  }
})();