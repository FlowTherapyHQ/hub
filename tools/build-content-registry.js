"use strict";

const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "..", "articles");
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "assets",
  "js",
  "content-registry.js"
);

console.log("");
console.log("FlowHub Content Registry Generator");
console.log("---------------------------------");
/* =========================================================
   HELPERS
   ========================================================= */

function decodeHTML(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");
}

function stripHTML(value = "") {
  return decodeHTML(
    String(value)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function getFirstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match && match[1]) {
      return stripHTML(match[1]);
    }
  }

  return "";
}

/* =========================================================
   ARTICLE FIELD EXTRACTORS
   ========================================================= */

function getArticleId(html, fileName) {
  const match = html.match(
    /data-article-id\s*=\s*["']([^"']+)["']/i
  );

  if (match && match[1]) {
    return match[1].trim();
  }

  return fileName.replace(/\.html?$/i, "");
}

function getTitle(html, fallbackId) {
  return (
    getFirstMatch(html, [
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ]) || fallbackId
  );
}

function getCategory(html) {
  return (
    getFirstMatch(html, [
      /class=["'][^"']*article-kicker[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
      /class=["'][^"']*article-category[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
      /class=["'][^"']*article-label[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
      /class=["'][^"']*category-label[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
    ]) || "FlowNotes"
  );
}

function getExcerpt(html) {
  return getFirstMatch(html, [
    /<p[^>]+class=["'][^"']*article-deck[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
    /<p[^>]+class=["'][^"']*article-subtitle[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
    /<p[^>]+class=["'][^"']*hero-description[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  ]);
}
/* =========================================================
   MORE ARTICLE FIELD EXTRACTORS
   ========================================================= */

function getReadTime(html) {
  const articleMatch = html.match(
    /<article\b[^>]*>([\s\S]*?)<\/article>/i
  );

  const articleHTML = articleMatch
    ? articleMatch[1]
    : html;

  const text = stripHTML(articleHTML);

  const words = text
    .split(/\s+/)
    .filter(Boolean);

  const wordsPerMinute = 225;

  const minutes = Math.max(
    1,
    Math.ceil(words.length / wordsPerMinute)
  );

  return `${minutes} min`;
}

function getPublishDate(html) {
  const patterns = [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<time[^>]+datetime=["']([^"']+)["']/i,
    /data-publish-date=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match && match[1]) {
      return match[1].trim().slice(0, 10);
    }
  }

  return "";
}

function getUpdatedDate(html) {
  const patterns = [
    /<meta[^>]+property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
    /data-updated-date=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match && match[1]) {
      return match[1].trim().slice(0, 10);
    }
  }

  return "";
}

function getImage(html) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<img[^>]+class=["'][^"']*article-image[^"']*["'][^>]+src=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
}
function getFeatured(html) {
  return /data-featured\s*=\s*["']true["']/i.test(html);
}
/* =========================================================
   TAG GENERATOR
========================================================= */
function createTags(title, category, excerpt) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "and",
    "are",
    "because",
    "been",
    "before",
    "being",
    "between",
    "both",
    "can",
    "does",
    "from",
    "have",
    "help",
    "how",
    "into",
    "more",
    "most",
    "that",
    "the",
    "their",
    "them",
    "then",
    "there",
    "these",
    "they",
    "this",
    "through",
    "what",
    "when",
    "where",
    "which",
    "while",
    "why",
    "with",
    "your",
  ]);

  const source = `${title} ${category} ${excerpt}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ");

  const words = source
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length >= 4 &&
        !stopWords.has(word)
    );

  return [...new Set(words)].slice(0, 10);
}

/* =========================================================
   READ ARTICLE FILES
   ========================================================= */

if (!fs.existsSync(ARTICLES_DIR)) {
  console.error(`Articles folder not found: ${ARTICLES_DIR}`);
  process.exit(1);
}

const articleFiles = fs
  .readdirSync(ARTICLES_DIR)
  .filter((fileName) =>
    fileName.toLowerCase().endsWith(".html")
  )
  .sort();

console.log(`Found ${articleFiles.length} HTML article files.`);
/* =========================================================
   BUILD ARTICLE OBJECTS
   ========================================================= */

const articles = [];

for (const fileName of articleFiles) {
  const filePath = path.join(ARTICLES_DIR, fileName);

  const html = fs.readFileSync(
    filePath,
    "utf8"
  );

  const id = getArticleId(
    html,
    fileName
  );

  const title = getTitle(
    html,
    id
  );

  const category = getCategory(
    html
  );

  const excerpt = getExcerpt(
    html
  );

  const readTime = getReadTime(
    html
  );

  const publishDate = getPublishDate(
    html
  );

  const updatedDate = getUpdatedDate(
    html
  );

  const image = getImage(
    html
  );
  const featured = getFeatured(
    html
);

  const tags = createTags(
    title,
    category,
    excerpt
  );

  articles.push({
    id,
    title,
    category,
    publishDate,
    updatedDate,
    readTime,
    featured,
    image,
    excerpt,
    url: `/articles/${fileName}`,
    tags,
  });
}

/* =========================================================
   BASIC VALIDATION
   ========================================================= */

const duplicateIds = articles
  .map((article) => article.id)
  .filter(
    (id, index, allIds) =>
      allIds.indexOf(id) !== index
  );

if (duplicateIds.length) {
  console.error("");
  console.error("Duplicate article IDs found:");

  for (const id of [...new Set(duplicateIds)]) {
    console.error(`- ${id}`);
  }

  console.error("");
  process.exit(1);
}

console.log(
  `Built ${articles.length} article records in memory.`
);
/* =========================================================
   SORT ARTICLES
   ========================================================= */

articles.sort((a, b) => {
  const dateA = a.publishDate
    ? new Date(a.publishDate).getTime()
    : 0;

  const dateB = b.publishDate
    ? new Date(b.publishDate).getTime()
    : 0;

  return dateB - dateA;
});

/* =========================================================
   FEATURED ARTICLE
   ========================================================= */

const featuredArticles = articles.filter(article => article.featured);

if (featuredArticles.length > 1) {
    console.warn(
        `Warning: ${featuredArticles.length} featured articles found. Only one should use data-featured="true".`
    );
}

if (featuredArticles.length === 0 && articles.length > 0) {
    console.warn(
        "No featured article found. Defaulting to newest article."
    );

    articles[0].featured = true;
}

/* =========================================================
   PREPARE GENERATED REGISTRY
   ========================================================= */

const generatedRegistry = `"use strict";

/* =========================================================
   FLOWHUB CMS — GENERATED CONTENT REGISTRY

   This file is generated by:
   tools/build-content-registry.js

   Do not manually edit generated article records.
   ========================================================= */

window.FlowHub = window.FlowHub || {};

FlowHub.version = "3.0.0";

FlowHub.articles = ${JSON.stringify(articles, null, 2)};

/* =========================================================
   HELPERS
   ========================================================= */

FlowHub.getArticle = function (id) {
  return FlowHub.articles.find(
    (article) => article.id === id
  );
};

FlowHub.getAllArticles = function () {
  return [...FlowHub.articles];
};

FlowHub.getFeaturedArticle = function () {
  return FlowHub.articles.find(
    (article) => article.featured
  );
};

FlowHub.getNewestArticles = function (limit = 6) {
  return [...FlowHub.articles]
    .sort(
      (a, b) =>
        new Date(b.publishDate || 0) -
        new Date(a.publishDate || 0)
    )
    .slice(0, limit);
};

FlowHub.getCategoryArticles = function (category) {
  return FlowHub.articles.filter(
    (article) =>
      article.category === category
  );
};
`;
/* =========================================================
   WRITE LIVE CONTENT REGISTRY
   ========================================================= */


fs.writeFileSync(
  OUTPUT_FILE,
  generatedRegistry,
  "utf8"
);

console.log("");
console.log("---------------------------------");
console.log("FlowHub content registry updated.");
console.log(`Article records: ${articles.length}`);
console.log(`Output file: ${OUTPUT_FILE}`);
console.log("---------------------------------");
console.log("");

if (articles.length !== articleFiles.length) {
  console.warn(
    `Warning: ${articleFiles.length} HTML files were found, but only ${articles.length} article records were created.`
  );
}