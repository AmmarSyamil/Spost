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


console.log("scroll js sybau works")
// Sybau, focus reels
function scroll_reels(data = document) {
    console.log("main fucntion run sybau")
    const requiredClasses = ["x1lliihq", "x5yr21d", "xh8yej3"];
    const srcPrefix = "blob:https://www.instagram.com/";
    const lastY = new WeakMap();
    let pollInterval = null;
    let lastMiddle = null;
    let lastMiddleChangeTime = 0;
    const DEBOUNCE_MS = 500;

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
        if (!is_afk) scroll_data.set("scroll_time", ((Date.now() - initial_open.getTime()) / 1000 / 60).toFixed(2));


        const middle = getMiddleReel();
        if (!middle) {
            console.log("cant find middle scrren sybau")
        };
        const y = middle.getBoundingClientRect().top || 0;
        const now = Date.now();
        if (lastMiddle === middle) {
            const prevY = lastY.get(middle);
            if (prevY !== undefined && Math.abs(y - prevY) > 8) {
                // console.log("Middle re?el scrolled: sybau", serialize(middle), "from", prevY, "to", y);
                // actualy_usecase("mibombo")
            }
            lastY.set(middle, y);
        } else {
            // console.log("not sybau nic")
            is_same_reel_for_reel_check_interval=false
            if (now - lastMiddleChangeTime > DEBOUNCE_MS) {
                // Only log and run usecase if debounce time has passed
                // console.log("sybau idk what is this st")
                actualy_usecase()
                lastMiddleChangeTime = now;
            }
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
                // console.log("sybau error")
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
            console.log("scroll_reels stopped. sybau");
        }
    };
}

console.log("run sybau");
const tes = scroll_reels(document);

let previus_scroll = new Date();
// let current_scroll = null
// let all_scroll = [];
let all_scroll_diff = [];
let all_diff_classification = [];
let is_first_reel = true;
let is_afk = false
let is_same_reel_for_reel_check_interval = false
const MAX_SCROLL_TIME = 5
const CHECK_SCROLL_DIFF_INTERVAL = 2    
const SCROLL_CHECK_INTERVAL = 5
let last_interval_minute = null;
// Diff classification
const diff_really_bad =  3000 //1
const diff_kinda_bad = 6000 //2


function actualy_usecase() {
    // console.log("run sybau")

    if (is_first_reel == true) {
        is_first_reel = false
    return  
    } 

    try {
        const current_scroll = new Date();
        const diff_scroll = Math.abs(current_scroll.getTime() - previus_scroll.getTime())


        scroll_data.get("scroll_diff").get("values").push(diff_scroll)        
        scroll_data.get("scroll_diff").get("at").push(current_scroll)

        all_scroll_diff.push(diff_scroll);

        if (diff_scroll <= diff_really_bad) {
            const current_diff_classification = 1;
            // console.log("sybau level 1 ", diff_scroll)
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            
            all_diff_classification.push(current_diff_classification)
        } if (diff_scroll <= diff_kinda_bad){
            const current_diff_classification = 2            
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            // console.log("sybau level 2", diff_scroll)
            all_diff_classification.push(current_diff_classification)
        } else {
            const current_diff_classification = 3
            // console.log("sybau level 3", diff_scroll)
            scroll_data.get("scroll_diff").get("classification").push(current_diff_classification)
            all_diff_classification.push(current_diff_classification)
        }
        
        // if(scroll_data.get("scroll_diff").get("values").length % 5 == 0 && scroll_data.get("scroll_diff").get("values") != 0) {
            
        //     console.log("sybau 5 reals pass and u still like this??")
        //     const session_classification = Math.abs(scroll_data.get("scroll_diff").get("classification").reduce((a, b) => a + b, 0)/scroll_data.get("scroll_diff").get("classification").length)
            
        //     console.log(scroll_data.get("scroll_time"), "sybau this is your total time")
        // }
        
        // console.log(scroll_data.get("scroll_time"), "tes tes sybau")
        
        previus_scroll = current_scroll
    }catch (error) {console.error("sybau errror", error)}
}


function actualy_usecase_always() {
    const current_scroll = new Date();
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
                
            // FUNCTION HERE TODO SOMETHINGS
            // console.log(avg_last_window_data, "sybau heres your alst 5 minutes data")
            // console.log(last_window_data, "sybau heres your idk what isit")
            if (avg_last_window_data<=2){
                // console.log("chill out ur so friking braintoted sybau")
            } else if (avg_last_window_data<=3) {
                // console.log("damn still fast but okay sybau")
            } else {
                // console.log("good good sybau")
            }
            overlay_function("INTERVAL", [avg_last_window_data, indices_time_data.length])
        }
        last_interval_minute = scroll_time_minutes
        }

    // if (scroll_data.get("scroll_time")/60 % 5 ==0 && scroll_data.get("scroll_time") != 0) {
    //     console.log("stop niga ur brainroted")
    // }
    
    // NO NEED TODO ANY FUNCITON, LOG IS ENOUGH
    // if (current_scroll.getSeconds() - previus_scroll.getSeconds() >= 30 && is_afk ==false) {
    //     console.log("AFK sybau")
    //     is_afk = true
    //     return
    // } else {
    //     is_afk = false
    // }
    
    //stronger get afk
    try {
        // const atArr = scroll_data.get("scroll_diff").get("at");
        if (scroll_data.get("scroll_diff").get("at").length>=1) {
        const raw_data = scroll_data.get("scroll_diff").get("at")[scroll_data.get("scroll_diff").get("at").length - 1];
        // const new_data = (raw_data instanceof Date) ? raw_data : new Date(raw_data);
        // console.log(raw_data, "sybau tes    ")
        const new_data = current_scroll.getSeconds() - raw_data.getSeconds()
        // console.log(new_data, "sybau tes 2")

        if (new_data >= 10 && is_afk==false) {
            // console.log("AFK sybau version 2")
            is_afk = true
            return
        } else {
            is_afk =false
        }}
    } catch (error) {console.log(error, "sybau error")}

    // scroll_data.get("scroll_diff").get("values").length
    // i dont think this is imprtant, like nig, so no need a functio for functionality
    if (scroll_data.get("scroll_diff").get("values").length % SCROLL_CHECK_INTERVAL === 0 && scroll_data.get("scroll_diff").get("values") !== 0 && is_same_reel_for_reel_check_interval ==false){
            
        // console.log("sybau 5 reals pass and u still like this??")

        
        const session_classification = scroll_data.get("scroll_diff").get("classification").reduce((a, b) => a + b, 0)/scroll_data.get("scroll_diff").get("classification").length
        if (!session_classification) {
            // console.log("sybau idkwhat is t", scroll_data.get("scroll_diff").get("classification"))
            // console.log("sybau not found session classification ")
        }
        // overlay_function("TEST", session_classification)    ?
        is_same_reel_for_reel_check_interval = true
        // console.log(scroll_data.get("scroll_time"), "sybau this is your total time")
    }
     
    // ADD FUNCTIONALITY TODO SOMETHING LIKE CRASHING OUT
    if (scroll_data.get("scroll_time") >= MAX_SCROLL_TIME) {
        // console.log("sybau current session dies") // maybe rip of the webs or so, or like damaging the html and sort of that or not just like force refresh or go to home page or just run TOTR
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
            // alert("Hello! This is a popup.");
            console.log("sybau popup test")
            console.log("sybau test",  data)
            if(data[0]) { //check here somethings is wrong
                window.showPopup({
                    title_desc: "You're scrolling too fast!",
                    body: "For the past " + data[1] + " reels averaging of " + (data[0]).toFixed(1) + " seconds per reel. Target time is 6 seconds for each reels."
                })}
                console.log("sybau should opening now")
        } else if (type == "TEST") {
            if (data < 3) {
                // alert("You're scrolling too fast for the past " + SCROLL_CHECK_INTERVAL + " reels! Averaging of " + (data).toFixed(1) + " seconds per reel. Target time is 6 seconds for each reels.");
                // console.log("sybau test 1")
                window.showPopup({
                    title_desc: "You're scrolling too fast!",   
                    body: "For the past " + SCROLL_CHECK_INTERVAL + " reels averaging of " + (data).toFixed(1) + " seconds per reel. Target time is 6 seconds for each reels."
                })
            }
        }
    } catch (error) {console.log(error)}
}