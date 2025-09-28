browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeTab") {
    const tabId = message.tabId;
    if (tabId) {
      browser.tabs.remove(tabId);
    } else {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
          browser.tabs.remove(tabs[0].id);
        }
      });
    }
  }
});

