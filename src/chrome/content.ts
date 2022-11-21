import $ from 'jquery';
import { escape } from 'html-escaper';
import {
  ReactMessageRes,
  ReactMessageListener,
  EntryLevelSetting,
  Settings,
  ScanJob,
  Years
} from '../types';
import {
  createELKeywords,
  renderFlags,
  replaceApostrophes,
  waitForTopCard
} from './utils';


let settings: Settings;

// Function called when a new message is received
const reactMessageListener: ReactMessageListener = (msg, sender, sendResponse) => {
  // Send stored settings back to app when requested
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
  } else if (msg.settings) {
    // Store settings sent from app
    settings = msg.settings;
    chrome.storage.sync.set(msg.settings, () => { });
  }

  return true;
}

chrome.runtime.onMessage.addListener(reactMessageListener);

// Scan job description html and flag keywords
const scanJob: ScanJob = (topCard, { entryLevel, clownlist }) => {
  const clownlistKeys = Object.keys(clownlist);

  // Check if job is explicitly listed as entry level
  const isEntryLevel = topCard.includes('Entry level');
  if ((!entryLevel || !isEntryLevel) && !clownlistKeys) return;

  // Combine clownlist with entry level variations
  const years = entryLevel ? entryLevel + 2 as Years : 0; // Add 2 to account for marks
  const clownlistKeywords = replaceApostrophes(clownlistKeys);
  const entryLevelKeywords = years && isEntryLevel ? createELKeywords(years, []) : [];
  const allKeywords = entryLevelKeywords.concat(clownlistKeywords);

  // Get job html as a string and search for keywords
  const job = $('#job-details')[0]['outerHTML'].toLowerCase();
  const flaggedKeywords = allKeywords.filter(k => {
    return job?.includes(k.toLowerCase()) ? true : false;
  });

  if (!flaggedKeywords.length) return;

  // Escape keywords then render
  const escapedKeywords = flaggedKeywords.map(k => escape(k));
  renderFlags(escapedKeywords);
}

// Run job scan whenever the job list or details rerender
const startObserver = () => {
  const config = { attributes: true, childList: true, subtree: true };
  const targetNode = $('.scaffold-layout__inner')[0];
  if (targetNode) {
    const observer = new MutationObserver(() => waitForTopCard(scanJob, settings, 0));
    observer.observe(targetNode, config);
  }
}

// Get settings and start observers once page is loaded
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
    if (!Object.keys(res).length) {
      // Create default settings if user settings don't exist
      const defaultEntryLevel: EntryLevelSetting = 5;
      settings = { entryLevel: defaultEntryLevel, clownlist: {} };
      chrome.storage.sync.set(settings, () => {});
      startObserver();
    } else {
      settings = { entryLevel: res.entryLevel, clownlist: res.clownlist };
      startObserver();
    }
  });
}
