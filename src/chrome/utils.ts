import $ from 'jquery';
import { Years, WaitForTopCard, CreateELKeywords } from "../types";
import suffixes from './suffixes.json';


const topCardClassName = "jobs-unified-top-card__job-insight";

// Wait for entry level element to load
export const waitForTopCard: WaitForTopCard = (scanJob, settings, count) => {
  if (count === 20) return; // Exit if not found after 10 seconds
  window.setTimeout(() => {
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
  suffixes.forEach(s => {
    // Add prefixes before adding to keywords
    keywords.push(` ${years}${s}`);
    keywords.push(`-${years}${s}`);
  });

  const nextYear = years + 1 as Years;
  return years === 15 ? keywords : createELKeywords(nextYear, keywords);
}

// Send in the clowns!
export const renderFlags = (keywords: string[]) => {
  const joinedKeywords = (keywords.map((k, i) => {
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
