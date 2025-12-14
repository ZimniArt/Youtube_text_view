let watchPage = "watch";
let homePage = "home";
let otherPage = "other";
let videoList = "my-video-list";
let pageManager = "ytd-page-manager";


function getPageType(){
    if(location.pathname === "/watch") return watchPage;
    if(location.pathname === "/") return homePage;
    else return otherPage;
}

function handlePage(){
    const page = getPageType();
    if(page ===watchPage){
        HandleWatchPage();
    }
    if(page ===homePage){
        HandleHomePage();
    }
    if(page ===otherPage){
        HandeleOtherPage();
    }
}
handlePage();

function HandleHomePage(){
    console.log("im at HomePage");

    let videoListContainer = document.getElementById(videoList);
    
    if(!videoListContainer){
        videoListContainer = document.createElement("div");
        videoListContainer.id = videoList
        videoListContainer.style.fontSize = "16px";
        videoListContainer.style.padding = "10px";
        videoListContainer.style.backgroundColor ="#000";
        videoListContainer.style.color =  "#fff";
        videoListContainer.style.flex = "0 0 100%";
        
    }
    
    
    
    waitForPageManager( (pageManager)=>{
        if (!videoListContainer.isConnected) {
            pageManager.prepend(videoListContainer);
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
    
            videoListContainer.appendChild(link);
        });
    });
    
    
    observer.observe(document.body, {childList: true, subtree: true});   

}    

//functions
function waitForPageManager(callback) {
    const obs = new MutationObserver(() =>{
        const pageManager_exist = document.querySelector(pageManager);
        if(pageManager_exist){
            obs.disconnect();
            callback(pageManager_exist);
        }
    })

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

