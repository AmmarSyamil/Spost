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

    function isTargetVideo(node) {
        if (!node || node.nodeType !== 1 || node.tagName !== "VIDEO") return false;
        if (!requiredClasses.every(c => node.classList.contains(c))) return false;
        if (!node.hasAttribute("playsinline")) return false;
        if (node.getAttribute("preload") !== "none") return false;
        const src = node.getAttribute("src") || "";
        if (!src.startsWith(srcPrefix)) return false;
        return true;
    }

    function findMatchesInNode(node) {
        const data_node = []
        
        if (isTargetVideo(node)) data_node.push(node)
        if (node.querySelectorAll) {
            data_node.push(...Array.from(node.querySelectorAll("video")).filter(isTargetVideo))
        }
        return data_node
    }
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const n of m.addedNodes){
                for (const v of findMatchesInNode(n)) {
                    console.log("Video added sybau:", v.getAttribute("src"));
                }
            }

            for (const n of m.removedNodes) {
                for (const sybau of findMatchesInNode(n)) {
                    console.log("Video deleted sybau", sybau.getAttribute("src"))
                }
            }
        }

        });


    observer.observe(data, {
        childList: true,
        subtree: true
    });
}
console.log("run sybau")
data= document
const tes = scroll_reels(data)
// tes.disconnect();
