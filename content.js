// const htmlContent = fileument.fileumentElement.outerHTML;
// console.log("Full HTML content:", htmlContent);




// browser.runtime.sendMessage({ html: htmlContent }) ;
function check(file = document) {
    current_page = null;



    const vid = file.querySelector('video') !== null;
    const audio = [...file.querySelectorAll("a")].some(a =>
    a.textContent.toLowerCase().includes("audio"));
    const reel = [...file.querySelectorAll("a")].some(a =>
    a.getAttribute("href")?.includes("/reels/"));
    const hasPlayLabel = file.querySelector('[aria-label="Press to play"]') !== null;
    // return hasVideo && (hasAudio || hasReelsLink || hasPlayLabel);
// }

// xmnaoh6
// IGDThreadList
    const Story = file.querySelector('div[data-pagelet="story_tray"]') !== null;
    if (Story) {
        current_page = "Home";
    }

    else {
        const href = Array.from(file.querySelectorAll("a")).map(a => (a.getAttribute("href") || "").trim());  
        const vids_reels = Array.from(file.querySelectorAll("video"));
        const images_reels = Array.from(file.querySelectorAll("img"));
        const reels = href.filter(h => /\/reels(\/|$)/i.test(h)).length;
        const audio_reels = href.filter(h => /\/reels\/audio\//i.test(h)).length;
        const post_reels = href.filter(h => /(^|\/)p\/[^\/]+/i.test(h)).length;
        const blop_reels = vids_reels.filter(v => (v.currentSrc || v.src || '').startsWith('blob:')).length;
        const img_counts_reels = images_reels.length;
        
        const is_reels = (reels + audio_reels + blop_reels)/3
        const is_explore = (post_reels + img_counts_reels)/2

        if (is_reels >is_explore) {
            current_page =  "Reels";
        } else if (is_explore > is_reels) {
            current_page =  "Explore";
        } else {
            current_page = "idk"
        }
    
        }
        
    // const Message = file.querySelector('div[data-pagelet="IGDThreadList"]') !== null;
    // if (Message) {
    //     current_page = "Message";
    // }
    return current_page;
    }



    

console.log(check());
// browser.runtime.sendMessage({ html: htmlContent }) ;

