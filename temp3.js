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
    const visible = new Set();
    // let pollInterval = null;
    let lastMiddle = null;
    let scheduled = false;
    const lastComputedOpacity = new WeakMap();

    const scrollOptions = { passive: true };
    const resizeOptions = false;
    const pauseState = new WeakMap();
    const lastLogTime = new WeakMap();
    
    function overlapRatio(element, middle) {
        try {
            const r1 = element.getBoundingClientRect();
            const r2 = middle.getBoundingClientRect();
            if (!r1.width || !r1.height || !r2.width || !r2.height) return 0;
            const x1 = Math.max(r1.left, r2.left);
            const x2 = Math.min(r1.right, r2.right);
            const y1 = Math.max(r1.top, r2.top);
            const y2 = Math.min(r1.bottom, r2.bottom);
            const iw = Math.max(0, x2 - x1);
            const ih = Math.max(0, y2 - y1);
            const intersection = iw * ih;
            const middleArea = r2.width * r2.height;
            if (middleArea === 0) return 0;
            return intersection / middleArea;
        } catch (e) { return 0; }
    }

    function looksLikeOverlay(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.tagName === 'VIDEO') return false; 
        if (el.classList && el.classList.contains('xcpsgoo')) return true;
        try {
            const cs = window.getComputedStyle(el);
            if (!cs) return false;
            const op = cs.opacity ? parseFloat(cs.opacity) : NaN;
            if (Number.isNaN(op)) return false;
            if (Math.abs(op - 1) > 1e-6) return false;
            const pos = cs.position || "";
            const zi = parseInt(cs.zIndex, 10);
            const inline = (el.getAttribute && (el.getAttribute('style') || ""));
            if (inline && (inline.includes('opacity') || inline.includes('transform'))) return true;
            if (pos === 'absolute' || pos === 'fixed' || pos === 'relative') {
                if (!Number.isNaN(zi) && zi >= 0) return true;
                if (cs.transform && cs.transform !== 'none') return true;
            }
        } catch (e) {}
        return false;

        
    }

    function findOverlayCandidateForMiddle(middle) {
        if (!middle) return null;
        let best = null;
        let bestScore = 0;

        try {
            const c1 = middle.querySelector && middle.querySelector('.xcpsgoo, div[style*="opacity"], div[style*="transform"]');
            if (c1 && looksLikeOverlay(c1)) {
                const score = overlapRatio(c1, middle);
                if (score > bestScore) { bestScore = score; best = c1; }
                // if very good overlap, return quickly
                if (score > 0.4) return c1;
            }
        } catch (e) {}

        try {
            const all = middle.querySelectorAll ? Array.from(middle.querySelectorAll('div')) : [];
            for (const d of all) {
                if (!looksLikeOverlay(d)) continue;
                const score = overlapRatio(d, middle);
                if (score > bestScore) { bestScore = score; best = d; }
            }
            if (best && bestScore >= 0.15) return best; // require at least 15% overlap
        } catch (e) {}

        try {
            let p = middle.parentElement, depth = 0;
            while (p && depth < 5) {
                if (p !== middle) {
                    const q = p.querySelector && p.querySelector('.xcpsgoo, div[style*="opacity"], div[style*="transform"]');
                    if (q && looksLikeOverlay(q)) {
                        const score = overlapRatio(q, middle);
                        if (score > bestScore) { bestScore = score; best = q; }
                    }
                }
                const sAttr = p.getAttribute && (p.getAttribute('style') || "");
                if (sAttr && (sAttr.includes('opacity') || sAttr.includes('transform')) && looksLikeOverlay(p)) {
                    const score = overlapRatio(p, middle);
                    if (score > bestScore) { bestScore = score; best = p; }
                }
                p = p.parentElement; depth++;
            }
            if (best && bestScore >= 0.15) return best;
        } catch (e) {}

        // 4) limited document-level fallback (only if related)
        try {
            const docCandidate = document.querySelector && (document.querySelector('.xcpsgoo') || document.querySelector('div[style*="opacity"][role], div[style*="transform"][role]'));
            if (docCandidate && looksLikeOverlay(docCandidate) && isRelatedToMiddle(docCandidate, middle, 6)) {
                const score = overlapRatio(docCandidate, middle);
                if (score >= 0.15) return docCandidate;
            }
        } catch (e) {}

        return null;
    }

    function isRelatedToMiddle(candidate, middle, maxDepth = 6) {
        if (!candidate || !middle) return false;
        if (candidate === middle) return false;
        try {
            if (middle.contains(candidate)) return true;
            if (candidate.contains(middle)) return true;
        } catch (e) {  }

        let a = candidate;
        for (let d = 0; d < maxDepth && a; d++, a = a.parentElement) {
            if (a === document) break;
            let b = middle;
            for (let e = 0; e < maxDepth && b; e++, b = b.parentElement) {
                if (!a || !b) break;
                if (a === b) return true;
            }
        }
        return false;
    }

    function getSrc(el) {
        return (el && (el.getAttribute("src") || el.src || "") || "").trim();
    }

    function isTargetVideo(node) {
        if (!node || node.nodeType !== 1 || node.tagName !== "VIDEO") return false;

        // fast src check: if this matches, accept it (less brittle).
        const src = getSrc(node);
        if (src && src.startsWith(srcPrefix)) return true;

        // fallback: require playsinline + preload none + most classes present
        if (!node.hasAttribute("playsinline")) return false;
        if (node.getAttribute("preload") !== "none") return false;

        // require at least 2 of the requiredClasses to match (relaxed)
        let matchCount = 0;
        for (const c of requiredClasses) if (node.classList && node.classList.contains(c)) matchCount++;
        if (matchCount < Math.max(1, Math.floor(requiredClasses.length / 2))) return false;

        return true;
    }

    function serialize(el) {
        return `${getSrc(el)} [classes="${Array.from(el.classList).join(" ")}"]`;
    }

    function computeMiddleFromVisible() {
        if (!visible.size) return null;
        const viewportCenterY = (window.innerHeight || document.documentElement.clientHeight) / 2;
        let minDist = Infinity;
        let middle = null;
        for (const v of visible) {
            if (!v.isConnected) continue;
            if (!isTargetVideo(v)) continue;
            const rect = v.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(centerY - viewportCenterY);
            if (dist < minDist) {
                minDist = dist;
                middle = v;
            }
        }
        return middle;
    }

    function detectMiddle_Pause() {
        const middle = computeMiddleFromVisible();
        if (!middle) {
            if (lastMiddle !== null) {
                lastMiddle = null;
                console.log("not find any middle reel sybau");
            }
            return null;
        }

        const prevState = pauseState.get(middle) || false;
        const candidate = findOverlayCandidateForMiddle(middle);

        // if no candidate found but we were paused before -> treat as resume
        if (!candidate) {
            if (prevState) {
                pauseState.set(middle, false);
                lastLogTime.delete(middle);
                // optional resume log:
                // console.log("resume detected for middle reel:", serialize(middle));
            }
            return null;
        }

        if (candidate.tagName === 'VIDEO') return null;

        // ensure candidate actually overlaps middle significantly (extra safety)
        const overlap = overlapRatio(candidate, middle);
        if (overlap < 0.15) {
            // if previously paused and the overlay disappeared / moved away -> resume
            if (prevState) {
                pauseState.set(middle, false);
                lastLogTime.delete(middle);
            }
            return null;
        }

        let opNow = NaN;
        try {
            const cs = window.getComputedStyle(candidate);
            opNow = cs && cs.opacity ? parseFloat(cs.opacity) : NaN;
        } catch (e) {}

        if (Number.isNaN(opNow)) return null;

        // update lastComputedOpacity for this candidate (watchPause also updates it)
        lastComputedOpacity.set(candidate, opNow);

        // determine paused state from computed opacity
        const isPausedNow = Math.abs(opNow - 1) < 1e-6;

        // dedupe: ignore if we logged recently for this middle
        const now = Date.now();
        const lastLog = lastLogTime.get(middle) || 0;

        if (isPausedNow && !prevState) {
            // check debounce window (400 ms)
            if (now - lastLog < 400) {
                pauseState.set(middle, true); // defensive
                return candidate;
            }
            // real transition not logged yet — log once and mark state
            pauseState.set(middle, true);
            lastLogTime.set(middle, now);
            console.log("pause detected for middle reel:", serialize(middle), "candidate:", candidate);
            return candidate;
        } else if (!isPausedNow && prevState) {
            // transitioned back to playing — update state
            pauseState.set(middle, false);
            lastLogTime.delete(middle);
            // optional: console.log("resume detected for middle reel:", serialize(middle));
        }

        return null;
    }


    function watchPause(root = document) {
        const mo = new MutationObserver((mutations) => {
            const currentMiddle = lastMiddle || computeMiddleFromVisible();
            if (!currentMiddle) return;

            for (const m of mutations) {
                if (m.type === 'attributes') {
                    const el = m.target;    
                    if (!isRelatedToMiddle(el, currentMiddle, 6)) continue;
                    if (el.tagName === 'VIDEO') continue;
                    try {
                        const cs = window.getComputedStyle(el);
                        const op = cs && cs.opacity ? parseFloat(cs.opacity) : NaN;
                        const prev = lastComputedOpacity.get(el);
                        if (Number.isNaN(op)) { lastComputedOpacity.set(el, op); continue; }
                        // update stored value
                        lastComputedOpacity.set(el, op);

                        // if this element was opaque and now not -> possible resume for current middle
                        if (prev !== undefined && Math.abs(prev - 1) < 1e-6 && Math.abs(op - 1) > 1e-6) {
                            // update state for current middle if related
                            try {
                                const middleNow = currentMiddle;
                                if (middleNow) {
                                    pauseState.set(middleNow, false);
                                    lastLogTime.delete(middleNow);
                                    // optional: console.log("resume detected via mutation for", serialize(middleNow));
                                }
                            } catch (e) {}
                            // don't return; continue processing other mutations
                        }

                        // if we just became opaque -> check pause
                        if ((prev === undefined || Math.abs(prev - 1) > 1e-6) && Math.abs(op - 1) < 1e-6) {
                            detectMiddle_Pause();
                            // continue checking other mutations
                        }
                    } catch (e) {}
                } else if (m.type === 'childList') {
                    let touched = false;
                    if (m.addedNodes && m.addedNodes.length) {
                        for (const node of m.addedNodes) {
                            if (node.nodeType !== 1) continue;
                            if (isRelatedToMiddle(node, currentMiddle, 6)) { touched = true; break; }
                        }
                    }
                    if (!touched && m.removedNodes && m.removedNodes.length) {
                        for (const node of m.removedNodes) {
                            if (node.nodeType !== 1) continue;
                            if (isRelatedToMiddle(node, currentMiddle, 6)) { touched = true; break; }
                        }
                    }
                    if (touched) { detectMiddle_Pause(); return; }
                }
            }
        });

        try {
            mo.observe(root, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.warn("watchPause: observer attach failed", e);
        }

        return function stop() {
            try { mo.disconnect(); } catch (e) {}
        };
    }

    function detectMiddleScroll() {
        scheduled = false;
        const middle = computeMiddleFromVisible();
        if (!middle) {
            if (lastMiddle !== null) {
                lastMiddle = null;
                console.log("not find any middle reel sybau");
            }
            return;
        }

        const y = middle.getBoundingClientRect().top || 0;
        if (lastMiddle === middle) {
            const prevY = lastY.get(middle);
            if (prevY !== undefined && Math.abs(y - prevY) > 8) {
                console.log("Middle reel scrolled sybau:", serialize(middle), "from", prevY, "to", y);
            }
            lastY.set(middle, y);
        } else {
            console.log("New middle reel sybau:", serialize(middle));
            lastY.set(middle, y);
        }
        lastMiddle = middle;
        // detectMiddle_Pause()
    }

    const observe_reel = new IntersectionObserver((entries) => {
        let changed = false;
        for (const e of entries) {
            const el = e.target;
            if (!isTargetVideo(el)) {
                if (visible.has(el)) { visible.delete(el); changed = true; }
                continue;
            }
            if (e.isIntersecting) {
                if (!visible.has(el)) { visible.add(el); changed = true; }
            } else {
                if (visible.has(el)) { visible.delete(el); changed = true; }
            }
        }
        if (changed && !scheduled) {
            scheduled = true;
            requestAnimationFrame(detectMiddleScroll);
        }
    }, {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    function attachObserverToVideos(root) {
        try {
            const vids = root.querySelectorAll ? Array.from(root.querySelectorAll("video")) : [];
            vids.forEach(v => {
                try {
                    observe_reel.observe(v);
                } catch (e) { /* ignore */ }
            });

            // Quick manual seed: mark as visible any video that overlaps the viewport center by >20%
            // This prevents waiting for IntersectionObserver callbacks at init time.
            const viewportCenterY = (window.innerHeight || document.documentElement.clientHeight) / 2;
            vids.forEach(v => {
                try {
                    if (!isTargetVideo(v)) return;
                    const r = v.getBoundingClientRect();
                    if (!r.width || !r.height) return;
                    const centerY = r.top + r.height / 2;
                    const dist = Math.abs(centerY - viewportCenterY);
                    // if center is within 40% of viewport height from center, treat as visible seed
                    if (dist < (window.innerHeight || document.documentElement.clientHeight) * 0.4) {
                        if (!visible.has(v)) visible.add(v);
                    }
                } catch (e) {}
            });
        } catch (e) { /* ignore */ }
    }

    if (data.querySelectorAll) attachObserverToVideos(data);

    const Observer_mutation = new MutationObserver((mutations) => {
        let changed = false;
        for (const m of mutations) {
            if (m.type === "childList") {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === "VIDEO") {
                        try { observe_reel.observe(node); } catch (e) {}
                        changed = true;
                    } else {
                        attachObserverToVideos(node);
                    }
                }
                for (const node of m.removedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === "VIDEO") {
                        try { observe_reel.unobserve(node); } catch (e) {}
                        visible.delete(node);
                        changed = true;
                    } else {
                        const vids = node.querySelectorAll ? node.querySelectorAll("video") : [];
                        vids.forEach(v => {
                            try { observe_reel.unobserve(v); } catch (e) {}
                            visible.delete(v);
                            changed = true;
                        });
                    }
                }
            } else if (m.type === "attributes") {
                const node = m.target;
                if (node && node.tagName === "VIDEO") {
                    try { observe_reel.observe(node); } catch (e) {}
                    changed = true;
                }
            }
        }
        if (changed && !scheduled) {
            scheduled = true;
            requestAnimationFrame(detectMiddleScroll);
        }
    });

    Observer_mutation.observe(data, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "class", "preload", "playsinline"]
    });

    function runDetection() {
        detectMiddleScroll();
        // const watches_pause = watchPause();
    };

    const watches_pauses = watchPause();

    window.addEventListener("scroll", runDetection, { passive: true });
    window.addEventListener("resize", runDetection);

    // Initial detection
    runDetection();

    return {
        stop() {
            window.removeEventListener("scroll", runDetection, { passive: true });
            window.removeEventListener("resize", runDetection);
            try {watches_pauses();} catch (e) {}
            lastMiddle = null;
            console.log("scroll reels stop");
        }
    };
}

console.log("run sybau");   
const tes = scroll_reels(document);




function detect_pause_reels(data = document) {
    const requiredClasses = ["xcpsgoo",  "x1c9tyrk", "xeusxvb", "x1pahc9y","x1ertn4p", "xpgaw4o", "xyamay9", "xv54qhq", "x1l90r2v", "xf7dkkf", "x10l6tqk", "x1puwpt7"];

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

    

    pollInterval = setInterval(() => {
        try {
            detectMiddleScroll();
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
            console.log("scroll_reels stopped.");
        }
    };
}