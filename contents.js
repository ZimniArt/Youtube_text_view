let textListContainer = document.getElementById("my-text-list");

if(!textListContainer){
    textListContainer = document.createElement("div");
    textListContainer.id = "my-text-list";
    textListContainer.style.fontSize = "16px";
    textListContainer.style.padding = "10px";
    textListContainer.style.backgroundColor ="#000";
    textListContainer.style.color =  "#fff";
    textListContainer.style.flex = "0 0 100%";
    
}


waitForPageManager( (pageManager)=>{
    if (!textListContainer.isConnected) {
        pageManager.prepend(textListContainer);
    }
});


const titleList = new Set();

const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll(".yt-lockup-metadata-view-model__text-container");

    videos.forEach(video => {
        const titleLink = video.querySelector(".yt-lockup-metadata-view-model__title");
        if (!titleLink) return;

        const title = titleLink.textContent?.trim();
        const href = titleLink.getAttribute("href");

        if (!title || !href) return;
        if (titleList.has(title)) return;

        titleList.add(title);

        const link = document.createElement("a");
        link.textContent = title;
        link.href = href;
        link.target = "_self";

        link.style.display = "block";
        link.style.color = "#fff";
        link.style.textDecoration = "none";
        link.style.marginBottom = "6px";
        link.style.cursor = "pointer";

        link.addEventListener("mouseenter", () => {
            link.style.textDecoration = "underline";
        });

        link.addEventListener("mouseleave", () => {
            link.style.textDecoration = "none";
        });

        textListContainer.appendChild(link);
    });
});


observer.observe(document.body, {childList: true, subtree: true});   


//functions
function waitForPageManager(callback) {
    const obs = new MutationObserver(() =>{
        const pageManager = document.querySelector("ytd-page-manager");
        if(pageManager){
            obs.disconnect();
            callback(pageManager);
        }
    })

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}