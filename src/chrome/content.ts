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
  checkPrefixes,
  createELKeywords,
  renderDescription,
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
    chrome.storage.sync.set(msg.settings, () => {});
    const response: ReactMessageRes = {
      status: 'Successfully stored settings!',
      body: {}
    };

    sendResponse(response);
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

  // Get job html as a string and search for keywords
  const sourced = $('#job-details div').length; // Jobs sourced from job board
  const jobIndex = sourced ? 1 : 0;
  const job = $('#job-details span')[jobIndex]['innerHTML'].toLowerCase();
  const flaggedKeywords: string[] = [];
  clownlistKeywords.forEach(k => job?.includes(k.toLowerCase()) ? flaggedKeywords.push(k) : null);
  entryLevelKeywords.forEach(k => {
    const validated = checkPrefixes(job, k);
    if (validated) flaggedKeywords.push(validated);
  });

  renderDescription(flaggedKeywords, sourced);
  if (!flaggedKeywords.length) return;

  // Escape keywords then render
  const escapedKeywords = flaggedKeywords.map(k => escape(k));
  renderFlags(escapedKeywords);
}

// Run job scan whenever job container mutates
const startObserver = () => {
  const config = { attributes: true, childList: true, subtree: true };
  const targetNode = $('.scaffold-layout__list-detail-inner')[0];
  if (targetNode) {
    const observer = new MutationObserver((mutations) => {
      const targetLength = $(mutations[0].target).children('span').length;
      const loopLength = mutations.length === 2 || mutations.length === 3;
      const willLoop = loopLength && mutations[0]['type'] === 'childList' && targetLength;
      console.log('MUTATIONS ', mutations)
      if (!willLoop) waitForTopCard(scanJob, settings, 0);
    });
    observer.observe(targetNode, config);
  }
}

// Get settings and start observer once page is loaded
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
