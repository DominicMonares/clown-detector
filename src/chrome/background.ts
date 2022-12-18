import { Settings } from '../types';


const tabTracker: { [key: string]: string } = {};

// Re-inject content script after every page update
const injectContent = () => {
  chrome.tabs.query({}, async tabs => {
    // Get first content script from manifest
    const manifest = chrome.runtime.getManifest();
    const contentScript = manifest.content_scripts ? manifest.content_scripts[0] : null;
    const contentJs = contentScript ? contentScript.js : null;
    const contentJsFile = contentJs ? contentJs[0] : null;
    if (contentJsFile) {
      for (let tab of tabs) {
        if (tab.status === 'complete' && tab.id && tab.url) {
          // Store tab id and corresponding url, compare current to previous each injection
          if (!tabTracker[tab.id]) tabTracker[tab.id] = tab.url;
          const linkedin = 'linkedin.com';
          const currentURL = tab.url;
          const previousURL = tabTracker[tab.id];
          const searchURL = `${linkedin}/jobs/search`;
          const viewURL = `${linkedin}/jobs/view`;
          tabTracker[tab.id] = currentURL;
          const onJobPage = currentURL?.includes(searchURL) || currentURL?.includes(viewURL);
          if (onJobPage) {
            // Manually reload if using back button on non-job LinkedIn page
            // Not doing so breaks the job post event listeners
            const noPreviousJob = !previousURL.includes(searchURL) && !previousURL.includes(viewURL);
            const returnToSearch = currentURL?.includes(searchURL) && previousURL.includes(viewURL);
            if ((noPreviousJob && previousURL.includes(linkedin)) || returnToSearch) {
              await chrome.tabs.reload();
            } else {
              chrome.scripting.executeScript({
                target: { tabId: tab.id as number, allFrames: true },
                files: [contentJsFile]
              });
            }
          };
        }
      }
    }
  });
}

chrome.tabs && chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.status === 'complete') injectContent();
});

// Tell content script to save new settings to storage
export const applySettings = ({ entryLevel, clownlist }: Settings) => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      { settings: { entryLevel, clownlist } },
      res => res
    );
  });

  chrome.tabs.reload();
  window.close();
}
