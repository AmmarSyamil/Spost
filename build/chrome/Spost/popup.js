const browser = globalThis.browser || globalThis.chrome;

let popupCreated = false;
let is_counting_down = false;
let is_continue_counting = false;
// let is_cross_counting = false;

function enableButtons() {
    document.getElementById("cancel").style.pointerEvents = 'auto';
    document.getElementById("confirm").style.pointerEvents = 'auto';
    document.getElementById("close").style.pointerEvents = 'auto';
    document.getElementById("cancel").style.opacity = '1';
    document.getElementById("confirm").style.opacity = '1';
    document.getElementById("close").style.opacity = '1';
}

function countdown() {
    if (is_continue_counting) return;
        is_continue_counting = true;
        let TIMER_CLOSE = 5;
        document.getElementById("modal-body-text").textContent = TIMER_CLOSE + " seconds left before you can continue.";
        TIMER_CLOSE--;
        document.getElementById("cancel").style.pointerEvents = 'none';
        document.getElementById("confirm").style.pointerEvents = 'none';
        document.getElementById("close").style.pointerEvents = 'none';
        document.getElementById("cancel").style.opacity = '0.5';
        document.getElementById("confirm").style.opacity = '0.5';
        document.getElementById("close").style.opacity = '0.5';
        const interval = setInterval(() => {
            document.getElementById("modal-body-text").textContent = TIMER_CLOSE + " seconds left before you can continue.";
             TIMER_CLOSE--;
            if (TIMER_CLOSE < 0) {
                clearInterval(interval);
                enableButtons();
                document.getElementById('popup').classList.remove('visible');
                is_continue_counting = false;
                TIMER_CLOSE=5
                // browser.runtime.sendMessage({ action: "closeTab" });s
            }
        }, 1000);
    }

window.showPopup = function({title, title_desc, body, type}={}) {
    if (!popupCreated) {
        const popupHTML = `
        <div class="backdrop" id="popup">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
            <div class="modal-header">
            <div>
                <div class="title" id="modal-title">title</div>
                <div class="subtitle" id="modal-desc">title desc</div>
            </div>
            <button class="icon-btn" id="close" aria-label="Close popup">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            </div>

            <div class="modal-body">
            <p id="modal-body-text">body</p>
            </div>

            <div class="modal-actions">
            <button class="ghost" id="cancel">Continue</button>
            <button class="primary" id="confirm">Close app</button>
            </div>
        </div>
        </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
        .backdrop {
            position: fixed; inset: 0; display: none;
            align-items: center; justify-content: center;
            backdrop-filter: blur(10px) saturate(115%);
            background: rgba(0,0,0,0.35);
            z-index: 1200; padding: 20px;
        }
            .backdrop.visible {
            display: flex;
        }

        .modal {
            width: min(480px, 90vw);
            border-radius: 14px;
            background: linear-gradient(180deg, rgba(255, 182, 193, 0.15), rgba(255, 105, 180, 0.08));
            border: 1px solid rgba(255, 182, 193, 0.3);
            box-shadow: 0 10px 40px rgba(255, 20, 147, 0.35);
            padding: 20px;
            backdrop-filter: blur(8px) saturate(180%);
            display: flex; flex-direction: column; gap: 14px;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .title {
            color: #fff0f6;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);

        }

        .subtitle {
            font-size: 13px;
            /* color: #ffd6e9;  */
            /* color: #9fb0c8;  */
            color: #d7d7d7;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .modal-body {
            font-size: 14px;
            color: #cbd5e1;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .ghost {
            background: transparent;
            border: 1px solid rgba(255,182,193,0.75);
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            color: #ffe6f1;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .ghost:hover {
            background: rgba(255,182,193,0.15);
            border-color: rgba(255,182,193,1);
            color: white;
            transform: translateY(-1px);
        }
        .primary {
            background: linear-gradient(90deg,#ec4899,#d955f7);
            color: white;
            border: 0;
            padding: 9px 16px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(236, 72, 153, 0.35);
            transition: all 0.25s ease;
        }
        .primary:hover {
            /* box-shadow: 0 5px 15px rgba(217, 85, 247, 0.45); */
            /* opacity: 0.; */
            background : rgb(255, 3, 3);
            color: rgb(255, 255, 255);
            transform: translateY(-1px);
        }
        .icon-btn {
            background: transparent; border: 0; cursor: pointer; color: #9fb0c8;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center; justify-content: center;
            transition: all 0.1s ease;
        }
        .icon-btn:hover {
            background: rgba(255, 182, 193, 0.15);
            color: white;
        }
        `;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.innerHTML = popupHTML;
        document.body.appendChild(div);

        const popup = document.getElementById('popup');
        const closeBtn = document.getElementById('close');
        const continueBtn = document.getElementById('cancel');
        const closeAppBtn = document.getElementById('confirm');
        closeBtn.addEventListener('click', () => countdown());
        continueBtn.addEventListener('click', () => {
            countdown()
            // enableButtons();
            // if (is_continue_counting) return;
            // is_continue_counting = true;
            // let TIMER_CLOSE = 5;
            // document.getElementById("modal-body-text").textContent = TIMER_CLOSE + " seconds left before you can continue.";
            // TIMER_CLOSE--;
            // document.getElementById("cancel").style.pointerEvents = 'none';
            // document.getElementById("confirm").style.pointerEvents = 'none';
            // document.getElementById("close").style.pointerEvents = 'none';
            // document.getElementById("cancel").style.opacity = '0.5';
            // document.getElementById("confirm").style.opacity = '0.5';
            // document.getElementById("close").style.opacity = '0.5';
            // const interval = setInterval(() => {
            //     document.getElementById("modal-body-text").textContent = TIMER_CLOSE + " seconds left before you can continue.";
            //     TIMER_CLOSE--;
            //     if (TIMER_CLOSE < 0) {
            //         clearInterval(interval);
            //         enableButtons();
            //         popup.classList.remove('visible');
            //         is_continue_counting = false;
            //         TIMER_CLOSE=5
            //         // browser.runtime.sendMessage({ action: "closeTab" });s
            //     }
            // }, 1000);
        });

        closeAppBtn.addEventListener('click', () => {
            enableButtons();
            popup.classList.remove('visible');
            browser.runtime.sendMessage({ action: "closeTab" });
        });

        popupCreated = true;
    }
    if (type === "close") {
        if (is_counting_down) return;
        is_counting_down = true;
        document.getElementById("cancel").style.pointerEvents = 'none';
        document.getElementById("confirm").style.pointerEvents = 'none';
        document.getElementById("close").style.pointerEvents = 'none';
        document.getElementById("cancel").style.opacity = '0.5';
        document.getElementById("confirm").style.opacity = '0.5';
        document.getElementById("close").style.opacity = '0.5';
        document.getElementById("modal-body-text").textContent = "Preparing to close tab...";
        browser.runtime.sendMessage({ action: "getTabId" }).then(response => {
            const tabId = response.tabId;
            let timer = 5;
            document.getElementById("modal-body-text").textContent = timer + " seconds left before automatically close tab.";
            timer--;
            const interval = setInterval(() => {
                document.getElementById("modal-body-text").textContent = timer + " seconds left before automatically close tab.";
                timer--;
                if (timer < 0) {
                    clearInterval(interval);
                    enableButtons();
                    document.getElementById('popup').classList.remove('visible');
                    is_counting_down = false;
                    browser.runtime.sendMessage({ action: "closeTab", tabId });
                }
            }, 1000);
        });
    }
    if (!title) {document.getElementById("modal-title").textContent = "Spost checker here";} else {document.getElementById("modal-title").textContent = title;};
    document.getElementById("modal-desc").textContent = title_desc;

    if (type !== "close") {
        document.getElementById("modal-body-text").textContent = body;
        enableButtons();
    }
    document.getElementById('popup').classList.add('visible');
}
