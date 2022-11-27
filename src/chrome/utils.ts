import $ from 'jquery';
import {
  CreateELKeywords,
  CheckPrefixes,
  WaitForTopCard,
  Years
} from "../types";
import suffixes from './suffixes.json';


const topCardClassName = "jobs-unified-top-card__job-insight";

// Wait for entry level element to load
export const waitForTopCard: WaitForTopCard = (scanJob, settings, count) => {
  if (count === 10) return; // Exit if not found after 5 seconds
  setTimeout(() => {
    const topCards = $(`.${topCardClassName}`);
    if (topCards.length) {
      if (topCards[0]['children'][2]) return; // Prevent duplicate renders
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
  // Cap off at 9 years to avoid false positives with double digits
  return years === 14 ? keywords : createELKeywords(nextYear, keywords);
}

export const checkPrefixes: CheckPrefixes = (job, keyword) => {
  const index = job.indexOf(keyword);
  if (index) {
    const prefix = job.slice(index - 4, index); // Allow room for 2 spaces, 1 dash, and num
    const firstDigit = Number(job[index - 1]);
    // If range of years found, return entire range
    if (prefix.indexOf('-') >= 0) {
      for (let i = prefix.indexOf('-') - 1; i > 0; i--) {
        if (Number(prefix[i])) return `${prefix.slice(i)}${keyword}`;
      }
    } else if (firstDigit && firstDigit > 1) {
      // If double digit, might be years since company was founded
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
export const renderDescription = (keywords: string[]) => {
  const jobSpan = $('#job-details span');
  const newJob = jobSpan[2];

  let jobHTML = jobSpan[0].innerHTML;
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

  const topCard = $(`.${topCardClassName}`).first();
  const newHTML = $(`
    <span style="display:flex; align-items:center; margin-left:10px;">
      <span style="margin-right:10px; font-size: 17px">&#129313;</span>
      <span>${joinedKeywords}</span>
    </span>
  `);

  topCard.append(newHTML);
}
