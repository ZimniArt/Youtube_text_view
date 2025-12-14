let watchPage = "watch";
let homePage = "home";
let otherPage = "other";
let videoList = "my-video-list";
let pageManager = "ytd-page-manager";

//this specific youtube event firing at mutation points
window.addEventListener("yt-navigate-finish", handlePage);

let currentPage = null;
let newPage = null;

let observer = null;

function getPageType(){
    if(location.pathname === "/watch") return watchPage;
    if(location.pathname === "/") return homePage;
    else return otherPage;
}

function handlePage(){

    newPage = getPageType();
    if(newPage===currentPage) return;
    currentPage=newPage;
    if(observer){
        StopObserver();
    }

    if(newPage ===watchPage) HandleWatchPage();
    if(newPage ===homePage)HandleHomePage();
    if(newPage ===otherPage)HandeleOtherPage();
}
handlePage();

function HandleHomePage(){

    console.log("going to Home page");

    let videoListContainer = document.getElementById(videoList);
    
    if(!videoListContainer){
        videoListContainer = document.createElement("div");
        videoListContainer.id = videoList;
        videoListContainer.style.position = "fixed";
        videoListContainer.style.top = "64px"; // below YouTube header
        videoListContainer.style.left = "10vw";       // start at left edge of viewport
        videoListContainer.style.right = "2vw";      // stretch to right edge
        videoListContainer.style.width = "90w";   
        videoListContainer.style.height = "calc(100vh - 80px)";
        videoListContainer.style.zIndex = "9999";
        videoListContainer.style.overflowY = "auto";
        videoListContainer.style.background = "rgba(0,0,0,0.85)";
        videoListContainer.style.backdropFilter = "blur(6px)";
        videoListContainer.style.borderRadius = "5px";
        videoListContainer.style.boxShadow = "0 8px 30px rgba(0,0,0,0.9)";
        
    }
    
    waitForPageManager( (pageManager)=>{
        if (!videoListContainer.isConnected) {
            pageManager.prepend(videoListContainer);
        }
    });
    
    const titleList = new Set();  
    videoListContainer.innerHTML = "";

    AddvideosToList(videoListContainer, titleList);

    observer = new MutationObserver(() => {
        AddvideosToList(videoListContainer, titleList);
    });
    
    observer.observe(document.body, {childList: true, subtree: true});   
    
    
    
}    

function AddvideosToList(videoListContainer, titleList){

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
}
function HandleWatchPage(){
    console.log("going to Watch page");
    
    observer = new MutationObserver(()=>{
        const removeBlock = document.querySelector(".style-scope ytd-watch-next-secondary-results-renderer");
        if (removeBlock) {
            removeBlock.remove();
        }
        
    })
    observer.observe(document.body, {childList: true, subtree: true});
}

function StopObserver(){
    if (!observer) return;
    console.log(" observer disconected");
    observer.disconnect();
    observer = null;
}
function waitForPageManager(callback) {

    const existing = document.querySelector(pageManager);
    if (existing) {
        callback(existing);
        return;
    }

    const obs = new MutationObserver(() => {
        const pageManager_exist = document.querySelector(pageManager);
        if (pageManager_exist) {
            obs.disconnect();
            callback(pageManager_exist);
        }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
}