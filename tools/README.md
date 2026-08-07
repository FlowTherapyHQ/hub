# FlowHub CMS Tools

FlowHub uses a lightweight static content-management system.

## Publishing a New FlowNote

1. Copy:

   articles/Templates/article-template.html

2. Rename the copy using the article slug.

   Example:

   massage-for-runners.html

3. Complete the article content and metadata.

4. Save the article.

5. Run:

   node tools/build-content-registry.js

6. Confirm that the terminal reports the expected number of article records.

7. Preview the article locally.

8. Commit and push the changes to GitHub.

## Content Registry

The live registry is:

assets/js/content-registry.js

Do not manually maintain article records in this file.

The article HTML files are the source of truth.

The registry generator automatically determines:

- Article ID
- Title
- Category
- Publish date
- Updated date
- Reading time
- Featured status
- Image
- Excerpt
- URL
- Tags

## Featured FlowNote

The featured article uses:

data-featured="true"

Only the article intended to be featured should use this setting.

If no article is explicitly featured, the registry generator can fall back to the newest article.

## Automatic Article Features

FlowHub automatically provides:

- Related FlowNotes
- Previous/next FlowNote navigation
- Generated article metadata
- Shared site header
- Shared site footer

## Important Files

tools/build-content-registry.js
Builds the article registry.

assets/js/content-registry.js
Generated article data used by FlowHub.

assets/js/article-utils.js
Article metadata, related content, and previous/next navigation.

assets/js/related-articles.js
Calculates related FlowNotes.

assets/js/site-layout.js
Shared header and footer.

assets/css/style.css
Main stylesheet entry point.
