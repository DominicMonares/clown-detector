import { escape } from 'html-escaper';
import $ from 'jquery';
import {
  ReactMessageRes,
  ReactMessageListener,
  EntryLevelSetting,
  Settings,
  ScanJob,
  Years
} from '../types';

import { createELKeywords, createFlag, replaceApostrophes, waitForTopCard } from './helpers';


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
    chrome.storage.sync.set(msg.settings, () => {});
  }

  return true;
}

chrome.runtime.onMessage.addListener(reactMessageListener);

// Scan job and flag keywords
const scanJob: ScanJob = (topCard, { entryLevel, clownlist }) => {
  const clownlistKeys = Object.keys(clownlist);

  // Check if job is listed explicitly as entry-level
  const isEntryLevel = topCard.includes('Entry level');
  if (!isEntryLevel || (!entryLevel && !clownlistKeys)) return;

  // Combine clownlist with entry level variations
  const years = entryLevel + 2 as Years;
  const clownlistKeywords = replaceApostrophes(clownlistKeys);
  const entryLevelKeywords = entryLevel ? createELKeywords(years, []) : [];
  const allKeywords = entryLevelKeywords.concat(clownlistKeywords);

  // Get job html as a string and look for keywords
  const job = $('#job-details')[0].outerHTML.toLowerCase();
  const flaggedKeywords = allKeywords.filter(k => {
    return job?.includes(k.toLowerCase()) ? true : false;
  });

  // Escape keywords then render
  const escapedKeywords = flaggedKeywords.map(k => escape(k));
  createFlag(escapedKeywords);
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
