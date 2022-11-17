import {
  ReactMessageReq,
  ReactMessageRes,
  EntryLevelSetting,
  Settings
} from '../types';

let settings: Settings;

// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: ReactMessageReq,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ReactMessageRes) => void
) => {
  console.log('[content.js]. Message received', msg);

  if (!Object.keys(msg).length) {
    chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
      const storedSettings: Settings = {
        entryLevel: res.entryLevel,
        clownlist: res.clownlist
      };

      const response: ReactMessageRes = {
        status: 'Successfully fetched settings!',
        body: {
          settings: storedSettings
        }
      };

      sendResponse(response);
    });

    return true;
  } else if (msg.urlUpdated) {
    waitForTopCard(scanJob);

    const response: ReactMessageRes = {
      status: 'Successfully fetched settings!',
      body: {}
    };

    sendResponse(response);
    return true;
  } else if (msg.settings) {
    settings = msg.settings;
    chrome.storage.sync.set(msg.settings, () => {});
  }

  return true;
}

// Fired when a message is sent from either an extension process or a content script
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// Run page scan once page is loaded
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
    if (!Object.keys(res).length) {
      const defaultEntryLevel: EntryLevelSetting = 5;
      settings = { entryLevel: defaultEntryLevel, clownlist: {} };
      chrome.storage.sync.set(settings, () => {
        console.log('Default values set!');
        waitForTopCard(scanJob)
      });
    } else {
      settings = { entryLevel: res.entryLevel, clownlist: res.clownlist };
      waitForTopCard(scanJob);
    }
  });

}

const scanJob = (topCard: string) => {
  const isEntryLevel = topCard.includes('Entry level');
  // implement clownlist logic here

  console.log('IS ENTRY LEVEL ', isEntryLevel);
}

const waitForTopCard = (callback: (topCard: string) => void) => {
  window.setTimeout(function(){
    const topCardClassName = "jobs-unified-top-card__job-insight";
    const topCards = document.getElementsByClassName(topCardClassName);

    if (topCards.length){
      const topCard = topCards[0]['children'][1]['innerHTML'];
      callback(topCard);
    } else {
      waitForTopCard(callback);
    }
  }, 500)
}
