import { ReactMessageRes, Settings } from '../types';

chrome.tabs && chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { urlUpdated: true });
  }
});

export const applySettings = ({ entryLevel, clownlist }: Settings) => {
  chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0]['id'] || 0,
      { settings: { entryLevel, clownlist } },
      (res: ReactMessageRes) => {}
    );
  });

  chrome.tabs.reload();
  window.close();
}
