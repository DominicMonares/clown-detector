import { Settings } from '../types';


// Inject content script on install
const installScript = () => {
  chrome.tabs.query({}, tabs => {
    const manifest = chrome.runtime.getManifest();
    const contentScript = manifest.content_scripts ? manifest.content_scripts[0] : null;
    const contentJs = contentScript ? contentScript.js : null;
    const contentJsFile = contentJs ? contentJs[0] : null;
    if (contentJsFile) {
      for (let tab of tabs) {
        if (tab.url?.includes('linkedin.com/jobs')) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id as number, allFrames: true},
            files: [contentJsFile]
          });
        };
      }
    }
  });
}

chrome.runtime.onInstalled.addListener(installScript);

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
