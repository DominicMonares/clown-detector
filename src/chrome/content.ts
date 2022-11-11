import { DOMMessageResponse, EntryLevel, Settings } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: Settings,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log('[content.js]. Message received', msg);

  const topCardClassName = "jobs-unified-top-card__job-insight";
  const topCards = document.getElementsByClassName(topCardClassName);
  const topCard = topCards[0]['children'][1]['innerHTML'];
  const isEntryLevel = topCard.includes('Entry level');

  if (isEntryLevel) scanJob(msg);

  const response: DOMMessageResponse = {
    tbd: isEntryLevel // response tbd
  };

  sendResponse(response);
}

const scanJob = (msg: Settings) => {
  console.log('MESSAGE ', msg)
  return ''
}

// Fired when a message is sent from either an extension process or a content script
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'blacklist'], (res) => {
    if (!Object.keys(res).length) {
      const defaultEntryLevel: EntryLevel = 4;
      const defaultSettings = { entryLevel: defaultEntryLevel, blacklist: [] };
      chrome.storage.sync.set(defaultSettings, () => {
        console.log('Default values set!');
        scanJob(defaultSettings);
      });
    } else {
      const storedSettings = { entryLevel: res.entryLevel, blacklist: res.blacklist };
      scanJob(storedSettings);
    }
  });
}
