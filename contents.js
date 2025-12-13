console.log("test extension_start");
const element = document.querySelectorAll(".yt-lockup-metadata-view-model__text-container");

const titleList = new Set();

const observer = new MutationObserver(function observer(){
    const videos = document.querySelectorAll(".yt-lockup-metadata-view-model__text-container");
    videos.forEach(
        function(video){
            const title = video.querySelector(".yt-lockup-metadata-view-model__title")?.textContent?.trim();
            
            if(titleList.has(title)) return;
            titleList.add(title);

            if(title) console.log(title);
        }
    )
});

observer.observe(document.body, {childList: true, subtree: true});   
console.log("test extension_end");
