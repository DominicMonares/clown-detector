import {
  ReactMessageRes,
  ReactMessageListener,
  EntryLevelSetting,
  Settings
} from '../types';


let settings: Settings;

// Function called when a new message is received
const reactMessageListener: ReactMessageListener = (msg, sender, sendResponse) => {
  console.log('[content.js]. Message received', msg);

  // Handle settings request from app
  if (!Object.keys(msg).length) {
    chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
      const storedSettings: Settings = {
        entryLevel: res.entryLevel,
        clownlist: res.clownlist
      };

      const response: ReactMessageRes = {
        status: 'Successfully fetched settings!',
        body: { settings: storedSettings }
      };

      sendResponse(response);
    });

  // Handle updated url
  } else if (msg.urlUpdated) {
    waitForTopCard(scanJob);
    const response: ReactMessageRes = {
      status: 'Successfully fetched settings!',
      body: {}
    };

    sendResponse(response);
  // Handle settings update
  } else if (msg.settings) {
    settings = msg.settings;
    chrome.storage.sync.set(msg.settings, () => { });
  }

  return true;
}

chrome.runtime.onMessage.addListener(reactMessageListener);

// Run page scan for criteria defined then update page
const scanJob = (topCard: string) => {
  const isEntryLevel = topCard.includes('Entry level');
  // implement clownlist logic here

  console.log('IS ENTRY LEVEL ', isEntryLevel);
}

// Wait for entry-level element to load
const waitForTopCard = (callback: (topCard: string) => void) => {
  window.setTimeout(function () {
    const topCardClassName = "jobs-unified-top-card__job-insight";
    const topCards = document.getElementsByClassName(topCardClassName);

    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      callback(topCard);
    } else {
      waitForTopCard(callback);
    }
  }, 500);
}

// Get settings and run scan on page load
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
    if (!Object.keys(res).length) {
      const defaultEntryLevel: EntryLevelSetting = 5;
      settings = { entryLevel: defaultEntryLevel, clownlist: {} };
      chrome.storage.sync.set(settings, () => {
        console.log('Default values set!');
        waitForTopCard(scanJob);
      });
    } else {
      settings = { entryLevel: res.entryLevel, clownlist: res.clownlist };
      waitForTopCard(scanJob);
    }
  });
}
