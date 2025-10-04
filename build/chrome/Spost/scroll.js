const data = document
console.log("Spost run")
// Configurable stuff!
const MAX_SCROLL_TIME = 25 // Total time per session before self destruct, in minutes
const CHECK_SCROLL_DIFF_INTERVAL = 2 // Time interval to check scroll diff, in minutes
const SCROLL_CHECK_INTERVAL = 5 // Deprecated
const DIFF_REALLY_BAD = 3000 // Classification threshold for really bad (ms)
const DIFF_KINDA_BAD = 6000 // Classification threshold for kinda bad (ms)
const AFK_THRESHOLD = 60 // AFK detection threshold in seconds
const DEBOUNCE_MS = 500 // Debounce for reel change detection (ms)


//Deprecated function
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
// Data structure
let initial_open = new Date();
const scroll_data = new Map([
  ["scroll_time", 0],
  ["scroll_diff", new Map(
    [
      ["values", []],
      ["classification", []],
      ["at", []]
    ]
  )]
])


function scroll_reels(data = document) {
    // console.log("main fucntion run sybau")
    const requiredClasses = ["x1lliihq", "x5yr21d", "xh8yej3"];
    const srcPrefix = "blob:https://www.instagram.com/";
    const lastY = new WeakMap();
    let pollInterval = null;
    let lastMiddle = null;
    let lastMiddleChangeTime = 0;

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
        if (is_afk) return;

        scroll_data.set("scroll_time", ((Date.now() - initial_open.getTime() - total_afk_time) / 1000 / 60).toFixed(2));


        const middle = getMiddleReel();
        if (!middle) {
            console.log("Spost cant find middle scrren")
        };
        const y = middle.getBoundingClientRect().top || 0;
        const now = Date.now();
        if (lastMiddle === middle) {
            const prevY = lastY.get(middle);
            if (prevY !== undefined && Math.abs(y - prevY) > 8) {
                // actualy_usecase("mibombo")
            }
            lastY.set(middle, y);
        } else {
            // console.log("not sybau nic")
            is_same_reel_for_reel_check_interval=false
            if (now - lastMiddleChangeTime > DEBOUNCE_MS) {
                // console.log("sybau idk what is this st")
                actualy_usecase()
                lastMiddleChangeTime = now;
            }
            lastY.set(middle, y);
        }
        lastMiddle = middle;
    }


    pollInterval = setInterval(() => {
        try {
            middle_reels = detectMiddleScroll();
            if (!middle_reels) {
                // console.log("sybau error")
            }
        } catch (e) {
            console.error("scroll_reels poll error:", e);
        }
    }, 300);

    return {
        stop() {
            observer.disconnect();
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
            console.log("scroll_reels stopped. sybau");
        }
    };
}

// console.log("run sybau");
const tes = scroll_reels(document);

let previus_scroll = new Date();
let current_scroll = new Date();
let temp_scroll = null
// let all_scroll = [];
let all_scroll_diff = [];
let all_diff_classification = [];
let is_first_reel = true;
let is_afk = false
let is_same_reel_for_reel_check_interval = false
let last_interval_minute = null;
let total_afk_time = 0;
let afk_start = null;


function actualy_usecase() {
    // console.log("run sybau")

    if (is_first_reel == true) {
        is_first_reel = false
    return  
    } 

    try {
        if (!is_afk) {
        current_scroll = new Date();
        const diff_scroll = Math.abs(current_scroll.getTime() - previus_scroll.getTime())


        scroll_data.get("scroll_diff").get("values").push(diff_scroll)        
        scroll_data.get("scroll_diff").get("at").push(current_scroll)

        all_scroll_diff.push(diff_scroll);

        if (diff_scroll <= DIFF_REALLY_BAD) {
            const current_diff_classification = 1;
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            all_diff_classification.push(current_diff_classification)
        } else if (diff_scroll <= DIFF_KINDA_BAD){
            const current_diff_classification = 2
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            all_diff_classification.push(current_diff_classification)
        } else {
            const current_diff_classification = 3
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            all_diff_classification.push(current_diff_classification)
        }

        previus_scroll = current_scroll}
    }catch (error) {console.error("sybau errror", error)}
}


function actualy_usecase_always() {
    // AFK logic first
    if (!is_afk) current_scroll = new Date();
    try {
        if (scroll_data.get("scroll_diff").get("at").length>=1) {
        const raw_data = scroll_data.get("scroll_diff").get("at")[scroll_data.get("scroll_diff").get("at").length - 1];
        const new_data = (new Date().getTime() - raw_data.getTime()) / 1000;

        if (is_afk) {console.log("Spost, current session is afk for:", new_data)}
        const was_afk = is_afk;
        is_afk = new_data >= AFK_THRESHOLD;
        if (is_afk && !was_afk) {
            afk_start = new Date();
            current_scroll = new Date();
        }
        if (!is_afk && was_afk) {
            total_afk_time += new Date() - afk_start;
            afk_start = null;
        }
    }
    } catch (error) {console.log(error, "sybau error")}

    if (is_afk) return;

    // current_scroll = new Date();
    const scroll_time_minutes = Math.floor(scroll_data.get("scroll_time"));
    // console.log(scroll_time_minutes, "sybau here idk ")
    if (scroll_time_minutes %CHECK_SCROLL_DIFF_INTERVAL ===0 && scroll_time_minutes !== 0 && last_interval_minute !== scroll_time_minutes) {
        // const TIME_WINDOW = 5
        const indices_time_data = scroll_data.get("scroll_diff").get("at")
            .map((date, idx) => ({date, idx}))
            .filter(({date}) => (current_scroll- date) / 1000/ 60 <= CHECK_SCROLL_DIFF_INTERVAL)
            .map(({idx}) => idx)

        if (indices_time_data.length > 0) {
            const last_window_data = indices_time_data.map(idx => scroll_data.get("scroll_diff").get("classification")[idx]);
            const avg_last_window_data = last_window_data.reduce((a, b) => a + b, 0) / last_window_data.length;

            if (avg_last_window_data<=2){
                // console.log("chill out ur so friking braintoted sybau")
            } else if (avg_last_window_data<=3) {
                // console.log("damn still fast but okay sybau")
            } else {
                // console.log("good good sybau")
            }
            if (!is_afk) overlay_function("INTERVAL", [avg_last_window_data, indices_time_data.length])
        }
        last_interval_minute = scroll_time_minutes
        }

    // Deprecated
    if (scroll_data.get("scroll_diff").get("values").length % SCROLL_CHECK_INTERVAL === 0 && scroll_data.get("scroll_diff").get("values") !== 0 && is_same_reel_for_reel_check_interval ==false){


        const session_classification = scroll_data.get("scroll_diff").get("classification").reduce((a, b) => a + b, 0)/scroll_data.get("scroll_diff").get("classification").length
        if (!session_classification) {
            // console.log("sybau not found session classification ")
        }
        // overlay_function("TEST", session_classification)    ?
        console.log("Spost, current session time:"+ scroll_data.get("scroll_time"))
        is_same_reel_for_reel_check_interval = true
    }

    if (!is_afk && scroll_data.get("scroll_time") >= MAX_SCROLL_TIME) {
        overlay_function("MAX_TIME")
    }
}

try {
    setInterval(actualy_usecase_always, 100);
} catch(error){console.log(error)}

function overlay_function(type, data =null) {
    try {
        if (type == "MAX_TIME") {

            window.showPopup({
                title_desc: "The maximum amount of time in current session is reach!",
                body: "Closing Instagram automaticaly!",
                type: "close"
            })
        } else if (type == "INTERVAL") {

            if(data[0] <3) { 
                window.showPopup({
                    title_desc: "You're scrolling too fast!",
                    body: "For the past " + data[1] + " reels averaging of " + (data[0]).toFixed(1) + " seconds per reel. Target time is 6 seconds for each reels."
                })}
        } else if (type == "TEST") { //deprecated
            if (data < 3) {
                window.showPopup({
                    title_desc: "You're scrolling too fast!",   
                    body: "For the past " + SCROLL_CHECK_INTERVAL + " reels averaging of " + (data).toFixed(1) + " seconds per reel. Target time is 6 seconds for each reels."
                })
            }
        }
    } catch (error) {console.log(error)}
}