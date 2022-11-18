import {
  ReactMessageRes,
  ReactMessageListener,
  EntryLevelSetting,
  Settings,
  ScanJob
} from '../types';

import { waitForTopCard } from './helpers';
import suffixes from './suffixes.json';


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
      return true;
    });

  // Handle updated url
  } else if (msg.urlUpdated) {
    waitForTopCard(scanJob, settings);
    const response: ReactMessageRes = {
      status: 'Successfully fetched settings!',
      body: {}
    };

    sendResponse(response);
    return true;

  // Handle settings update
  } else if (msg.settings) {
    settings = msg.settings;
    chrome.storage.sync.set(msg.settings, () => { });
  }

  return true;
}

chrome.runtime.onMessage.addListener(reactMessageListener);

const scanJob: ScanJob = (topCard, { entryLevel, clownlist }) => {
  // Check if job is listed explicitly as entry-level
  const isEntryLevel = topCard.includes('Entry level');
  if (!isEntryLevel) return;

  const clownlistKeywords = Object.keys(clownlist);
  const entryLevelKeywords = entryLevel ? suffixes.map(s => (entryLevel + 2) + s) : [];
  const allKeywords = clownlistKeywords.concat(entryLevelKeywords);
  const job = document.getElementById('job-details')?.outerHTML;
  const flaggedKeywords = allKeywords.filter(k => job?.includes(k) ? true : false);
  console.log('YOOOOOOO ', flaggedKeywords)


  // job-details ID

  console.log('JOB ', job)
  console.log('IS ENTRY LEVEL ', isEntryLevel);
}

// Get settings and run scan on page load
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
    if (!Object.keys(res).length) {
      const defaultEntryLevel: EntryLevelSetting = 5;
      settings = { entryLevel: defaultEntryLevel, clownlist: {} };
      chrome.storage.sync.set(settings, () => {
        console.log('Default values set!');
        waitForTopCard(scanJob, settings);
      });
    } else {
      settings = { entryLevel: res.entryLevel, clownlist: res.clownlist };
      waitForTopCard(scanJob, settings);
    }
  });
}
