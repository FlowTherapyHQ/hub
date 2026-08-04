(function () {

function initializeFlowNotesLibrary() {

    const cms = window.FlowHubCMS;

    if (!cms) return;

    renderArticles(cms.flowNotes);

}

function renderArticles(flowNotes) {

    const container = document.getElementById("flownotes-library");

    if (!container) return;

    container.innerHTML = "";

    flowNotes
        .sort((a,b)=>new Date(b.publishDate)-new Date(a.publishDate))
        .forEach(article=>{

            const card=document.createElement("article");

            card.className="flownote-card";

            card.innerHTML=`

                <span class="flownote-category">
                    ${article.category}
                </span>

                <h3>${article.title}</h3>

                <p class="meta">
                    ${formatDate(article.publishDate)}
                    •
                    ${article.readTime}
                </p>

                <p>
                    ${article.excerpt}
                </p>

                <a
                    href="${article.url}"
                    class="button"
                >
                    Read FlowNote →
                </a>

            `;

            container.appendChild(card);

        });

}

function formatDate(dateValue) {
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

if(document.readyState==="loading"){

    document.addEventListener(

        "DOMContentLoaded",

        initializeFlowNotesLibrary

    );

}else{

    initializeFlowNotesLibrary();

}

})();