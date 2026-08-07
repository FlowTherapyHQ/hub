"use strict";

/* =========================================================
   FLOWHUB CMS
   Version 2.0
   ========================================================= */

window.FlowHub = window.FlowHub || {};

FlowHub.version = "2.0";

/* =========================================================
   ARTICLES
   ========================================================= */

FlowHub.articles = [

    {
        id: "breathing-and-muscle-tension",

        title: "Breathing and Muscle Tension",

        category: "Stress & Wellness",

        publishDate: "2026-08-03",

        updatedDate: "2026-08-03",

        readTime: "6 min",

        featured: true,

        image:
            "/assets/images/flowresources/the-science-of-relaxation.png",

        excerpt:
            "Learn how stress may affect breathing patterns and how gentle breathing can support relaxation.",

        url:
            "/articles/breathing-and-muscle-tension.html",

        tags: [
            "breathing",
            "stress",
            "wellness",
            "relaxation",
            "nervous system"
        ]
    },

    {
        id: "five-minute-movement-breaks-for-busy-workdays",

        title: "Five-Minute Movement Breaks for Busy Workdays",

        category: "Workplace Wellness",

        publishDate: "2026-08-02",

        updatedDate: "2026-08-02",

        readTime: "5 min",

        featured: false,

        image: "",

        excerpt:
            "Simple movement breaks can help reduce stiffness during long workdays.",

        url:
            "/articles/five-minute-movement-breaks-for-busy-workdays.html",

        tags: [
            "movement",
            "office",
            "exercise",
            "desk",
            "stretching"
        ]
    },

    {
        id: "standing-desks-helpful-or-hype",

        title: "Standing Desks: Helpful or Hype?",

        category: "Workplace Wellness",

        publishDate: "2026-08-01",

        updatedDate: "2026-08-01",

        readTime: "7 min",

        featured: false,

        image: "",

        excerpt:
            "Explore the benefits and limitations of standing desks and practical ways to stay comfortable at work.",

        url:
            "/articles/standing-desks-helpful-or-hype.html",

        tags: [
            "standing desk",
            "ergonomics",
            "office",
            "workplace",
            "movement"
        ]
    }

];

/* =========================================================
   HELPERS
   ========================================================= */

FlowHub.getArticle = function(id) {

    return FlowHub.articles.find(article => article.id === id);

};

FlowHub.getAllArticles = function() {

    return [...FlowHub.articles];

};

FlowHub.getFeaturedArticle = function() {

    return FlowHub.articles.find(article => article.featured);

};

FlowHub.getNewestArticles = function(limit = 6) {

    return [...FlowHub.articles]

        .sort((a, b) =>

            new Date(b.publishDate) -

            new Date(a.publishDate))

        .slice(0, limit);

};

FlowHub.getCategoryArticles = function(category) {

    return FlowHub.articles.filter(

        article => article.category === category

    );

};