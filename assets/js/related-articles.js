"use strict";

/* =========================================================
   FLOWHUB CMS
   RELATED ARTICLE ENGINE
   Version 2.0
   ========================================================= */

window.FlowHub = window.FlowHub || {};

/* =========================================================
   Calculate similarity score
   ========================================================= */

FlowHub.calculateArticleScore = function (current, candidate) {

    // Never recommend itself
    if (current.id === candidate.id) return -1;

    let score = 0;

    /* Same category */

    if (current.category === candidate.category) {
        score += 50;
    }

    /* Shared tags */

    current.tags.forEach(tag => {

        if (candidate.tags.includes(tag)) {
            score += 10;
        }

    });

    /* Featured article bonus */

    if (candidate.featured) {
        score += 2;
    }

    /* Slight preference to newer content */

    score += (
        new Date(candidate.publishDate).getTime()
        / 100000000000000
    );

    return score;

};

/* =========================================================
   Get Related Articles
   ========================================================= */

FlowHub.getRelatedArticles = function (articleId, limit = 3) {

    const current = FlowHub.getArticle(articleId);

    if (!current) return [];

    return FlowHub.articles

        .map(article => ({

            article,

            score:
                FlowHub.calculateArticleScore(
                    current,
                    article
                )

        }))

        .filter(item => item.score >= 0)

        .sort((a, b) => b.score - a.score)

        .slice(0, limit)

        .map(item => item.article);

};