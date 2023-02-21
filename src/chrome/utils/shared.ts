import $ from 'jquery';
import {
  CreateELKeywords,
  CheckPrefixes,
  WaitForTarget,
  Years
} from "../../types";
import prefixes from '../prefixes.json';
import suffixes from '../suffixes.json';


// Wait for initial target element and return the site
export const waitForTarget: WaitForTarget = (startObserver, count) => {
  if (count === 10) return; // Exit if not found after 5 seconds
  setTimeout(() => {
    const linkedInSearchTarget = $('.scaffold-layout__list-detail-inner')[0];
    const linkedInViewTarget = $('.job-view-layout')[0];
    const indeedTarget = $('.jobsearch-ViewJobLayout-jobDisplay')[0];
    if (linkedInSearchTarget || linkedInViewTarget) {
      startObserver('linkedIn');
    } else if (indeedTarget) {
      startObserver('indeed');
    } else {
      return waitForTarget(startObserver, count + 1);
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
    const prefix = job.slice(index - 4, index);
    const prefixFound = prefixes.some(f => prefix.includes(f) ? true : false);
    const firstDigit = Number(job[index - 1]);
    const twentyPlus = firstDigit && firstDigit > 1;

    // Check for ranges in different formats
    const shortFirstNum = !Number.isNaN(prefix[prefix.length - 2]);
    const shortDash = prefix[prefix.length - 1] === '-';
    const shortRange = shortDash && shortFirstNum;
    const longFirstNum = !Number.isNaN(prefix[prefix.length - 4]);
    const longFirstSpace = prefix[prefix.length - 3] === ' ';
    const longDash = prefix[prefix.length - 2] === '-';
    const longSecondSpace = prefix[prefix.length - 1] === ' ';
    const longRange = longFirstNum && longFirstSpace && longDash && longSecondSpace
    const oddFirstNum = !Number.isNaN(prefix[prefix.length - 3]);
    const oddFirstSpace = prefix[prefix.length - 2] === ' ';
    const oddFirstDash = prefix[prefix.length - 2] === '-';
    const oddSecondSpace = prefix[prefix.length - 1] === ' ';
    const oddSecondDash = prefix[prefix.length - 1] === '-';
    const oddRange1 = oddFirstNum && oddFirstSpace && oddSecondDash;
    const oddRange2 = oddFirstNum && oddFirstDash && oddSecondSpace;
    const rangeFound = shortRange || longRange || oddRange1 || oddRange2;

    if (rangeFound) {
      // If range of years found, return entire range
      for (let i = prefix.length - 1; i > 0; i--) {
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

export const joinKeywords = (keywords: string[]) => {
  return keywords.map((k, i) => {
    if (k.startsWith(' ') || k.startsWith('-')) k = k.slice(1);
    return i === keywords.length - 1 ? k : k + ' · ';
  }).join('');
}
