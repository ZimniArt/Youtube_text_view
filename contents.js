console.log("test extension_start");

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

waitForPageManager( (pageManager)=>{
    if (!textListContainer.isConnected) {
    pageManager.prepend(textListContainer);
}
});


const titleList = new Set();
const observer = new MutationObserver(function observer(){
    const videos = document.querySelectorAll(".yt-lockup-metadata-view-model__text-container");
    videos.forEach(
        function(video){
            const title = video.querySelector(".yt-lockup-metadata-view-model__title")?.textContent?.trim();
            
            if (!title) return;
            if(titleList.has(title)) return;
            titleList.add(title);
            if(title) console.log(title);
            
            //adding to container
            const div = document.createElement("div");
            div.textContent = title;
            div.style.marginBottom = "5px";
            
            
            textListContainer.appendChild(div);
            
        }
    )
});

observer.observe(document.body, {childList: true, subtree: true});   
console.log("test extension_end");
