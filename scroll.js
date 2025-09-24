const data = document

function scroll_home(data = document) {
    const check_scroll_home = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {

                mutation.addedNodes.forEach(node => {
                    if (node.tagName == "ARTICLE") {
                        console.log("Add sybau", node)
                    }
                });

                mutation.removedNodes.forEach(node => {
                    if (node.tagName == 'ARTICLE') {
                        console.log("Remove sybau", node)
                    }
                })

                
            }
        }
    })


    check_scroll_home.observe(data, {
        childList: true,
        subtree: true
    })
}


// Sybau, focus reels
function scroll_reels(data = document) {
    const requiredClasses = ["x1lliihq", "x5yr21d", "xh8yej3"];
    const srcPrefix = "blob:https://www.instagram.com/";
    const lastY = new WeakMap();
    let pollInterval = null;
    let lastMiddle = null;

    function getSrc(el) {
        return (el && (el.getAttribute("src") || el.src || "") || "").trim();
    }

    function isTargetVideo(node) {
        if (!node || node.nodeType !== 1 || node.tagName !== "VIDEO") return false;
        if (!requiredClasses.every(c => node.classList.contains(c))) return false;
        if (!node.hasAttribute("playsinline")) return false;
        if (node.getAttribute("preload") !== "none") return false;
        const src = getSrc(node);
        if (!src.startsWith(srcPrefix)) return false;
        return true;

    }

    function getMiddleReel() {
        const videos = Array.from(data.querySelectorAll("video")).filter(isTargetVideo);
        if (!videos.length) return null;
        const viewportCenterY = (window.innerHeight || document.documentElement.clientHeight) / 2;
        let minDist = Infinity;
        let middleVideo = null;
        for (const v of videos) {
            const rect = v.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(centerY - viewportCenterY);
            if (dist < minDist) {
                minDist = dist;
                middleVideo = v;
            }
        }
        return middleVideo;
    }

    function serialize(el) {
        return `${getSrc(el)} [classes="${Array.from(el.classList).join(" ")}"]`;
    }

    function detectMiddleScroll() {
        const middle = getMiddleReel();
        if (!middle) return;
        const y = middle.getBoundingClientRect().top || 0;
        if (lastMiddle === middle) {
            const prevY = lastY.get(middle);
            if (prevY !== undefined && Math.abs(y - prevY) > 8) {
                // console.log("Middle reel scrolled:", serialize(middle), "from", prevY, "to", y);
            }
            lastY.set(middle, y);
        } else {
            console.log("New middle reel:", serialize(middle)); // here was the real functionality at.

            lastY.set(middle, y);
        }
        lastMiddle = middle;
    }

    // Initial scan
    // const middle = getMiddleReel();
    // if (middle) {
    //     lastY.set(middle, middle.getBoundingClientRect().top || 0);
    //     lastMiddle = middle;
    //     console.log("Initial middle reel:", serialize(middle));
    // }

    pollInterval = setInterval(() => {
        try {
            middle_reels = detectMiddleScroll();
            if (!middle_reels) {
                console.log("sybau error")
            }
        } catch (e) {
            console.error("scroll_reels poll error:", e);
        }
    }, 300);

    // const observer = new MutationObserver(mutations => {
    //     for (const m of mutations) {
    //         if (m.type === "childList") {
    //             for (const n of m.addedNodes) {
    //                 if (n.tagName === "VIDEO" && isTargetVideo(n)) {
    //                     console.log("Video added:", serialize(n));
    //                 }
    //             }
    //             for (const n of m.removedNodes) {
    //                 if (n.tagName === "VIDEO" && isTargetVideo(n)) {
    //                     console.log("Video removed:", serialize(n));
    //                 }
    //             }
    //         }
    //     }
    // });
    // observer.observe(data, {
    //     childList: true,
    //     subtree: true
    // });

    return {
        stop() {
            observer.disconnect();
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
            console.log("scroll_reels stopped.");
        }
    };
}

console.log("run sybau");
const tes = scroll_reels(document);



let previus_scroll = new Date();
let current_scroll = null

function actualy_usecase(scroll) {
    if (!scroll) {
        console.log("it should be possible like this niga")
        
    }
}