chrome.runtime.onInstalled.addListener(() => {
  // Disabled by default
  chrome.action.disable();
  chrome.action.setIcon({ path: '/disabled_icon-32.png' });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    const url = changeInfo.url;
    const searchUrl = 'linkedin.com/jobs/search/?currentJobId';
    const viewUrl = 'linkedin.com/jobs/view/';
    const searchUrlValid = url.includes(searchUrl);
    const viewUrlValid = url.includes(viewUrl);

    if (searchUrlValid || viewUrlValid) {
      chrome.action.enable();
      chrome.action.setIcon({ path: '/active_icon-32.png' });
      chrome.tabs.sendMessage(tabId, { urlUpdated: true });
    } else {
      chrome.action.disable();
      chrome.action.setIcon({ path: '/disabled_icon-32.png' });
    }
  }
});

export {};
