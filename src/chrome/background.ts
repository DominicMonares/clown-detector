chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'newURL',
        url: changeInfo.url
      });
    }
  }
);

export {};
