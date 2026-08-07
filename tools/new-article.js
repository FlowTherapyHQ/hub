"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFileSync } = require("child_process");

/* =========================================================
   FLOWHUB CMS
   NEW FLOWNOTE GENERATOR
   Version 1.0
   ========================================================= */

const ROOT_DIR = path.join(__dirname, "..");

const ARTICLES_DIR = path.join(
  ROOT_DIR,
  "articles"
);

const TEMPLATE_FILE = path.join(
  ARTICLES_DIR,
  "templates",
  "article-template.html"
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* =========================================================
   HELPERS
   ========================================================= */

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatMonthYear(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function todayISO() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  console.log("");
  console.log("=====================================");
  console.log(" FlowHub New FlowNote");
  console.log("=====================================");
  console.log("");

  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(
      `Template not found:\n${TEMPLATE_FILE}`
    );

    rl.close();
    process.exit(1);
  }

  const title = await ask(
    "Article title: "
  );

  if (!title) {
    console.error("Article title is required.");
    rl.close();
    process.exit(1);
  }

  const suggestedSlug = slugify(title);

  const slugInput = await ask(
    `Slug [${suggestedSlug}]: `
  );

  const slug =
    slugInput || suggestedSlug;

  const category = await ask(
    "Category: "
  );

  const defaultDate = todayISO();

  const publishDateInput = await ask(
    `Publish date [${defaultDate}]: `
  );

  const publishDate =
    publishDateInput || defaultDate;

  const featuredInput = await ask(
    "Featured article? (y/N): "
  );

  const featured =
    featuredInput.toLowerCase() === "y" ||
    featuredInput.toLowerCase() === "yes";

const subtitle = await ask(
  "Article subtitle: "
);

  const description = await ask(
    "Short description: "
  );

  const destinationFile = path.join(
    ARTICLES_DIR,
    `${slug}.html`
  );

  if (fs.existsSync(destinationFile)) {
    console.error("");
    console.error(
      `An article already exists:\n${destinationFile}`
    );

    rl.close();
    process.exit(1);
  }

  let html = fs.readFileSync(
    TEMPLATE_FILE,
    "utf8"
  );

  const monthYear =
    formatMonthYear(publishDate);

  /* =========================================================
     TEMPLATE REPLACEMENTS
     ========================================================= */

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>FlowNotes | ${escapeHTML(title)}</title>`
  );

  html = html.replace(
    /<body\b[^>]*>/i,
    `<body data-article-id="${escapeHTML(
      slug
    )}" data-featured="${featured}">`
  );

  html = html.replace(
    /<h1>[\s\S]*?<\/h1>/i,
    `<h1>${escapeHTML(title)}</h1>`
  );

html = html.replace(
  /<p\s+class=["']article-subtitle["']>[\s\S]*?<\/p>/i,
  `<p class="article-subtitle">
        ${escapeHTML(subtitle)}
      </p>`
);
html = html.replace(
  /(<nav\s+class=["']article-breadcrumbs["'][\s\S]*?<a[^>]*>FlowNotes<\/a>[\s\S]*?<span[^>]*>\/<\/span>\s*)<span>[\s\S]*?<\/span>/i,
  `$1<span>${escapeHTML(title)}</span>`
);
  html = html.replace(
    /<div class="article-label">[\s\S]*?<\/div>/i,
    `<div class="article-label">${escapeHTML(
      category
    )}</div>`
  );

  html = html.replace(
    /Month Year/g,
    monthYear
  );

  html = html.replace(
    /ARTICLE TITLE/g,
    escapeHTML(title)
  );

  html = html.replace(
    /Replace this with a one- or two-sentence summary that introduces the topic\./g,
    escapeHTML(description)
  );

  /* =========================================================
     META DESCRIPTION
     ========================================================= */

  if (
    /<meta\s+name=["']description["']/i.test(html)
  ) {
    html = html.replace(
      /<meta\s+name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/i,
      `<meta name="description" content="${escapeHTML(
        description
      )}" />`
    );
  }

  /* =========================================================
     ARTICLE DATES
     ========================================================= */

  if (
    /article:published_time/i.test(html)
  ) {
    html = html.replace(
      /(<meta\s+property=["']article:published_time["'][^>]*content=["'])[^"']*(["'][^>]*>)/i,
      `$1${publishDate}$2`
    );
  }

  if (
    /article:modified_time/i.test(html)
  ) {
    html = html.replace(
      /(<meta\s+property=["']article:modified_time["'][^>]*content=["'])[^"']*(["'][^>]*>)/i,
      `$1${publishDate}$2`
    );
  }

  /* =========================================================
     WRITE ARTICLE
     ========================================================= */

  fs.writeFileSync(
    destinationFile,
    html,
    "utf8"
  );

  /* =========================================================
   REBUILD CONTENT REGISTRY
   ========================================================= */

const registryBuilder = path.join(
  ROOT_DIR,
  "tools",
  "build-content-registry.js"
);

console.log("");
console.log("Updating FlowHub content registry...");

try {
  execFileSync(
    process.execPath,
    [registryBuilder],
    {
      cwd: ROOT_DIR,
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("");
  console.error(
    "Article was created, but the content registry could not be rebuilt."
  );
  console.error("");
  console.error(
    "You can rebuild it manually with:"
  );
  console.error(
    "node tools/build-content-registry.js"
  );
}
  console.log("");
  console.log("=====================================");
  console.log(" FlowNote created.");
  console.log("=====================================");
  console.log("");
  console.log(`Title:    ${title}`);
  console.log(`Slug:     ${slug}`);
  console.log(`Category: ${category}`);
  console.log(`Date:     ${publishDate}`);
  console.log(`Featured: ${featured}`);
  console.log("");
  console.log(`Created:`);
  console.log(destinationFile);
  console.log("");
  console.log("");
console.log("Next:");
console.log("1. Open the new article.");
console.log("2. Replace the placeholder article content.");
console.log("3. Add sources and article-specific details.");
console.log("4. Preview the page in your browser.");
console.log("");
console.log(
  "The FlowHub content registry was rebuilt automatically."
);
console.log("");
  rl.close();
}

main().catch((error) => {
  console.error("");
  console.error("Generator failed:");
  console.error(error);

  rl.close();
  process.exit(1);
});