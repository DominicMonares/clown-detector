import $ from 'jquery';
import { escape } from 'html-escaper';
import {
  ReactMessageRes,
  ReactMessageListener,
  EntryLevelSetting,
  Settings,
  ScanJob,
  Site,
  Years
} from '../types';
import {
  checkPrefixes,
  createELKeywords,
  renderLinkedInDescription,
  renderLinkedInFlags,
  replaceApostrophes,
  waitForPill,
  waitForTarget,
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

  renderLinkedInDescription(flaggedKeywords, sourced);
  if (!flaggedKeywords.length) return;

  // Escape keywords then render
  const escapedKeywords = flaggedKeywords.map(k => escape(k));
  renderLinkedInFlags(escapedKeywords);
}

// Run job scan whenever job container mutates
const startObserver = (site: Site) => {
  const config = { attributes: true, childList: true, subtree: true };

  if (site === 'linkedIn') {
    const linkedInSearchTarget = $('.scaffold-layout__list-detail-inner')[0];
    const linkedInViewTarget = $('.job-view-layout')[0];

    let loop2 = 0, loop3 = 0;
    if (linkedInSearchTarget || linkedInViewTarget) {
      const observer = new MutationObserver(mutations => {
        // Observer will infinitely loop and slow page speed when these conditions are met
        // However, these conditions need to be met in order to refresh flags
        // Use loop counter to break loops after 10 iterations
        const targetLength = $(mutations[0].target).children('span').length;
        const targetLoop = mutations[0]['type'] === 'childList' && targetLength;
        const loopLength2 = mutations.length === 2;
        const loopLength3 = mutations.length === 3;
        const willLoop2 = loopLength2 && targetLoop;
        const willLoop3 = loopLength3 && targetLoop;
        willLoop2 ? loop2++ : loop2 = 0;
        willLoop3 ? loop3++ : loop3 = 0;
        if ((loop2 < 10 && !loop3) || (loop3 < 10 && !loop2)) waitForTopCard(scanJob, settings, 0);
      });

      if (linkedInSearchTarget) {
        observer.observe(linkedInSearchTarget, config);
        return;
      } else {
        observer.observe(linkedInViewTarget, config);
      }
    }
  } else if (site === 'indeed') {
    const indeedTarget = $('.jobsearch-ViewJobLayout-jobDisplay')[0];
    if (indeedTarget) {
      const observer = new MutationObserver(mutations => {
        waitForPill(scanJob, settings, 0);
      });

      observer.observe(indeedTarget, config);
    }
  }
}

// Get settings and start observer once page is loaded
window.onload = () => {
  chrome.storage.sync.get(['entryLevel', 'clownlist'], res => {
    if (!Object.keys(res).length) {
      // Create default settings if user settings don't exist
      const defaultEntryLevel: EntryLevelSetting = 5;
      settings = { entryLevel: defaultEntryLevel, clownlist: {} };
      chrome.storage.sync.set(settings, () => { });
      waitForTarget(startObserver, 0);
    } else {
      settings = { entryLevel: res.entryLevel, clownlist: res.clownlist };
      waitForTarget(startObserver, 0);
    }
  });
}
