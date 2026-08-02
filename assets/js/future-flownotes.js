const futureFlowNotes = {
  "massage-education": [
    "How to Prepare for a Therapeutic Massage",
    "Can Massage Help Posture?",
    "Massage Myths That Just Won't Die"
  ],

  "movement-mobility": [
    "Joint Health and Healthy Movement",
    "Why Your Hips Affect Your Back",
    "Morning Mobility Routine"
  ],

  recovery: [
    "Foam Rolling: Helpful or Harmful?",
    "Does Massage Remove Lactic Acid?",
    "Recovery After Yard Work"
  ],

  "stress-wellness": [
    "Why You Hold Stress in Your Jaw",
    "The Science of Relaxation"
  ],

  "workplace-wellness": [
    "Standing Desks: Helpful or Hype?",
    "Preventing Tech Neck",
    "Building a Better Workstation"
  ]
};

const futureSection = document.querySelector("[data-future-category]");

if (futureSection) {
  const category = futureSection.getAttribute("data-future-category");
  const list = futureSection.querySelector(".future-flownotes-list");
  const topics = futureFlowNotes[category];

  if (list && topics) {
    list.innerHTML = "";

    topics.slice(0, 3).forEach(function (topic) {
      const item = document.createElement("li");
      item.textContent = topic;
      list.appendChild(item);
    });
  }
}