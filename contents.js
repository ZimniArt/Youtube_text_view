let watchPage = "watch";
let homePage = "home";
let subscriptionsPage = "subscriptions";
let otherPage = "other";
let videoList = "my-video-list";
let pageManager = "ytd-page-manager";

// YouTube navigation event
window.addEventListener("yt-navigate-finish", handlePage);

let currentPage = null;
let newPage = null;
let observer = null;

function getPageType() {
    if (location.pathname === "/watch") return watchPage;
    if (location.pathname === "/") return homePage;
    if (location.pathname === "/feed/subscriptions") return subscriptionsPage;
    return otherPage;
}

function handlePage() {
    newPage = getPageType();
    if (newPage === currentPage) return;
    currentPage = newPage;

    if (observer) stopObserver();

    switch (newPage) {
        case watchPage: handleWatchPage(); break;
        case homePage: handleVideoListPage(); break;
        case subscriptionsPage: handleVideoListPage(); break;
      //  case otherPage: handleOtherPage(); break;
    }
}
handlePage();

// Unified handler for pages with video lists (home & subscriptions)
function handleVideoListPage() {
    console.log("Video list page:", location.pathname);

    let videoListContainer = document.getElementById(videoList);
    
    if (!videoListContainer) {
        videoListContainer = document.createElement("div");
        videoListContainer.id = videoList;
        videoListContainer.style.position = "fixed";
        videoListContainer.style.top = "64px";
        videoListContainer.style.left = "5vw";
        videoListContainer.style.right = "2vw";
        videoListContainer.style.height = "calc(100vh - 80px)";
        videoListContainer.style.zIndex = "9999";
        videoListContainer.style.overflowY = "auto";
        videoListContainer.style.background = "rgba(0,0,0,0.85)";
        videoListContainer.style.backdropFilter = "blur(6px)";
        videoListContainer.style.borderRadius = "5px";
        videoListContainer.style.boxShadow = "0 8px 30px rgba(0,0,0,0.9)";
    }

    waitForPageManager(pageManagerNode => {
        if (!videoListContainer.isConnected) {
            pageManagerNode.prepend(videoListContainer);
        }
    });

    // --- Reset the list and set every page load ---
    const titleSet = new Set();  
    videoListContainer.innerHTML = "";

    addVideosToList(videoListContainer, titleSet);

    if (observer) observer.disconnect(); // disconnect previous observer

    observer = new MutationObserver(() => addVideosToList(videoListContainer, titleSet));
    observer.observe(document.body, { childList: true, subtree: true });
}

function handleWatchPage() {
    console.log("Watch page");
    observer = new MutationObserver(() => {
        const removeBlock = document.querySelector("ytd-watch-next-secondary-results-renderer");
        if (removeBlock) removeBlock.remove();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function handleOtherPage() {
    console.log("Other page:", location.pathname);
}

function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
}

// Wait for page manager element to appear
function waitForPageManager(callback) {
    const existing = document.querySelector(pageManager);
    if (existing) {
        callback(existing);
        return;
    }

    const obs = new MutationObserver(() => {
        const node = document.querySelector(pageManager);
        if (node) {
            obs.disconnect();
            callback(node);
        }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
}

// Add videos to your custom list
function addVideosToList(container, titleSet) {
    const videos = document.querySelectorAll(".yt-lockup-metadata-view-model__text-container");

    videos.forEach(video => {
        const titleLink = video.querySelector(".yt-lockup-metadata-view-model__title");
        if (!titleLink) return;

        const title = titleLink.textContent?.trim();
        const href = titleLink.getAttribute("href");

        if (!title || !href || titleSet.has(title)) return;

        titleSet.add(title);

        const link = document.createElement("a");
        link.textContent = title;
        link.href = href;
        link.target = "_self";
        link.style.display = "block";
        link.style.color = "#fff";
        link.style.textDecoration = "none";
        link.style.marginLeft = "10px";
        link.style.marginBottom = "8px";
        link.style.cursor = "pointer";

        link.addEventListener("mouseenter", () => link.style.textDecoration = "underline");
        link.addEventListener("mouseleave", () => link.style.textDecoration = "none");

        container.appendChild(link);
    });
}
