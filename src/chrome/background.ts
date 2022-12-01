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
          const currentURL = tab.url;
          const previousURL = tabTracker[tab.id];
          const jobsURL = 'linkedin.com/jobs';
          tabTracker[tab.id] = currentURL;
          if (currentURL?.includes(jobsURL)) {
            // Manually reload if using back button on non-job LinkedIn page
            // Not doing so breaks the job post event listeners
            if (!previousURL.includes(jobsURL) && previousURL.includes('linkedin.com')) {
              await chrome.tabs.reload();
            } else {
              tabTracker[tab.id] = currentURL;
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
