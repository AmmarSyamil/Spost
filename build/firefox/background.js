const browser = globalThis.browser || globalThis.chrome;

browser.runtime.onMessage.addListener((message, sender, send) => {
  if (message.action === "getTabId") {
    sendResponse({ tabId: sender.tab.id });
  } else if (message.action === "closeTab") {
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

jhfrsew});

