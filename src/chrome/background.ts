import { Settings } from '../types';


// Tell content script to run scanJob after url updates
chrome.tabs && chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) chrome.tabs.sendMessage(tabId, { urlUpdated: true });
});

// Tell content script to save new settings to storage
export const applySettings = ({ entryLevel, clownlist }: Settings) => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      { settings: { entryLevel, clownlist } }
    );
  });

  chrome.tabs.reload();
  window.close();
}
