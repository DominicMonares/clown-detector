import $ from 'jquery';
import {
  CreateELKeywords,
  CheckPrefixes,
  WaitForTopCard,
  Years
} from "../types";
import prefixes from './prefixes.json';
import suffixes from './suffixes.json';


const topCardClassName = "jobs-unified-top-card__job-insight";

// Wait for entry level element to load
export const waitForTopCard: WaitForTopCard = (scanJob, settings, count) => {
  if (count === 10) return; // Exit if not found after 5 seconds
  setTimeout(() => {
    const topCards = $(`.${topCardClassName}`);
    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      return scanJob(topCard, settings);
    } else {
      return waitForTopCard(scanJob, settings, count + 1);
    }
  }, 500);
}

export const replaceApostrophes = (keywords: string[]) => {
  return keywords.map(k => {
    return k.includes("'") ? k.split('').map(v => v === "'" ? '’' : v).join('') : k;
  });
}

export const createELKeywords: CreateELKeywords = (years, keywords) => {
  suffixes.forEach(s => keywords.push(`${years}${s}`));
  const nextYear = years + 1 as Years;
  return years === 15 ? keywords : createELKeywords(nextYear, keywords);
}

export const checkPrefixes: CheckPrefixes = (job, keyword) => {
  const index = job.indexOf(keyword);
  if (index) {
    const prefix = job.slice(index - 5, index);
    const prefixFound = prefixes.some(f => prefix.includes(f) ? true : false);
    const firstDigit = Number(job[index - 1]);
    const twentyPlus = firstDigit && firstDigit > 1;
    if (prefix.indexOf('-') >= 0) {
      // If range of years found, return entire range
      for (let i = prefix.indexOf('-') - 1; i > 0; i--) {
        if (Number(prefix[i])) return `${prefix.slice(i)}${keyword}`;
      }
    } else if (prefixFound || twentyPlus) {
      // If first digit greater than 1 or prefix found, likely years since company founded
      // Assume this, skip, and check rest of document
      return checkPrefixes(job.slice(index + 1), keyword);
    } else if (job.includes(keyword)) {
      return keyword;
    } else {
      return;
    }
  } else {
    return;
  }
}

// Highlight keywords and render new description
export const renderDescription = (keywords: string[], sourced: number) => {
  const jobSpan = $('#job-details span');
  const newJob = jobSpan[2];
  const sourcedDiv = $('#job-details div')[0];
  if (sourcedDiv) $('#job-details div')[0].remove();

  let jobHTML = jobSpan[sourced].innerHTML;
  keywords.forEach(k => {
    const keyword = k.replace('+', '\\+');
    const regex = new RegExp(keyword, 'ig');
    jobHTML = jobHTML.replace(regex, `<mark>${k}</mark>`);
  });

  if (newJob) $('#job-details span')[2].remove();
  $('#job-details span').hide(); // Hide instead of remove to preserve events
  $('#job-details').append(`<span>${jobHTML}</span>`);
}

// Send in the clowns!
export const renderFlags = (keywords: string[]) => {
  const joinedKeywords = (keywords.map((k, i) => {
    if (k.startsWith(' ') || k.startsWith('-')) k = k.slice(1);
    return i === keywords.length - 1 ? k : k + ' · ';
  })).join('');

  const spacer = '<!---->';
  const topHTML = $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'];
  if (topHTML.includes('🤡')) return; // Prevent duplicate renders

  const splitTop = topHTML.split(spacer);
  const textEnd = splitTop.length - 2;
  const clown = '<span style="font-size: 17px">🤡</span>';
  const newTop = `${splitTop[textEnd]}\xa0\xa0${clown}\xa0\xa0${joinedKeywords}`;
  splitTop[textEnd] = newTop;
  $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'] = splitTop.join(spacer);
}
