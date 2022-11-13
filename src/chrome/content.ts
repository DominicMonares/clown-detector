import { ReactMessageRes, EntryLevelSetting, Settings } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: Settings,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ReactMessageRes) => void
) => {
  console.log('[content.js]. Message received', msg);

  if (!Object.keys(msg).length) {
    chrome.storage.sync.get(['entryLevel', 'blacklist'], res => {
      const storedSettings: Settings = {
        entryLevel: res.entryLevel,
        blacklist: res.blacklist
      };

      const response: ReactMessageRes = {
        status: 'Successfully fetched settings!',
        response: storedSettings
      };

      sendResponse(response);
    });

    return true;
  }

  chrome.storage.sync.set(msg, () => {});
  return true;
}

// Fired when a message is sent from either an extension process or a content script
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// Run page scan once page is loaded
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'blacklist'], res => {
    if (!Object.keys(res).length) {
      const defaultEntryLevel: EntryLevelSetting = 5;
      const defaultSettings = { entryLevel: defaultEntryLevel, blacklist: new Set<string>() };
      chrome.storage.sync.set(defaultSettings, () => {
        console.log('Default values set!');
        scanJob(defaultSettings)
        setTimeout(() => scanJob(defaultSettings), 1000); // BANDAID FIX
      });
    } else {
      const storedSettings = { entryLevel: res.entryLevel, blacklist: res.blacklist };
      setTimeout(() => scanJob(storedSettings), 1000); // BANDAID FIX
    }
  });

}

const scanJob = (settings: Settings) => {
  const topCardClassName = "jobs-unified-top-card__job-insight";
  const topCards = document.getElementsByClassName(topCardClassName);
  const topCard = topCards[0]['children'][1]['innerHTML'];
  const isEntryLevel = topCard.includes('Entry level');
  // implement blacklist logic here

  console.log('IS ENTRY LEVEL ', isEntryLevel);
}
