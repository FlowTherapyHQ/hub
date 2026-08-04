"use strict";

/* =========================================================
   FLOWHUB CMS LITE — CONTENT REGISTRY

   Add and update FlowNotes and FlowResources here.
   Dates must use YYYY-MM-DD format.
   Only one item in each collection should normally have
   featured: true.
   ========================================================= */

window.FlowHubCMS = {
  version: "1.0.0",

  flowNotes: [
    {
      id: "breathing-and-muscle-tension",

      title: "Breathing and Muscle Tension",

      category: "Stress & Wellness",

      publishDate: "2026-08-03",

      readTime: "6-minute read",

      excerpt:
        "Learn how stress may affect breathing patterns and how gentle, comfortable breathing may support relaxation.",

      url: "/articles/breathing-and-muscle-tension.html",

      image:
        "/assets/images/flowresources/the-science-of-relaxation.png",

      imageAlt:
        "Preview for the Breathing and Muscle Tension FlowNote",

      featured: true,
    },

    {
      id: "five-minute-movement-breaks-for-busy-workdays",

      title: "Five-Minute Movement Breaks for Busy Workdays",

      category: "Workplace Wellness",

      publishDate: "2026-08-02",

      readTime: "5-minute read",

      excerpt:
        "Discover practical ways to add brief movement breaks throughout a busy workday.",

      url:
        "/articles/five-minute-movement-breaks-for-busy-workdays.html",

      image: "",

      imageAlt:
        "Preview for Five-Minute Movement Breaks for Busy Workdays",

      featured: false,
    },
{
    id: "standing-desks-helpful-or-hype",

    title: "Standing Desks: Helpful or Hype?",

    category: "Workplace Wellness",

    publishDate: "2026-08-01",

    readTime: "7-minute read",

    excerpt:
        "Learn when standing desks may help, their limitations, and practical strategies for reducing discomfort throughout the workday.",

    url:
        "/articles/standing-desks-helpful-or-hype.html",

    image: "",

    imageAlt:
        "Preview for Standing Desks: Helpful or Hype?",

    featured: false,
}
  ],

  flowResources: [
    {
      id: "flow-five-desk-routine",

      title: "The Flow Five™ Desk Routine",

      previewTitle: "The Flow Five™",

      previewSubtitle: "Desk Routine",

      category: "Movement & Mobility",

      publishDate: "2026-08-03",

      description:
        "Use five simple movements to reduce stiffness and reset after prolonged sitting or computer work.",

      previewNote: "5 simple movements for the workday",

      resourceUrl:
        "/assets/images/flow-five-desk-routine.png",

      relatedArticleUrl:
        "/articles/five-minute-movement-breaks-for-busy-workdays.html",

      featured: true,
    },
  ],
};