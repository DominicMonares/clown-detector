import { ReactMessageRes, EntryLevel, Settings } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: Settings,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ReactMessageRes) => void
) => {
  console.log('[content.js]. Message received', msg);

  if (!Object.keys(msg).length) {
    return chrome.storage.sync.get(['entryLevel', 'blacklist'], (res) => {

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
  }


  return true;
}

const scanJob = (msg: Settings) => {
  const topCardClassName = "jobs-unified-top-card__job-insight";
  const topCards = document.getElementsByClassName(topCardClassName);
  const topCard = topCards[0]['children'][1]['innerHTML'];
  const isEntryLevel = topCard.includes('Entry level');
  // implement blacklist logic here

  // if (isEntryLevel) {
  //   scanJob(msg);
  // }

  console.log('MESSAGE ', msg)
  console.log('CARD ', isEntryLevel);
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
