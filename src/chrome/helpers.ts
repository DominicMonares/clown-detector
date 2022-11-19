import $ from 'jquery';
import { Years, WaitForTopCard, CreateELKeywords } from "../types";
import suffixes from './suffixes.json';


const topCardClassName = "jobs-unified-top-card__job-insight";

// Wait for entry-level element to load
export const waitForTopCard: WaitForTopCard = (callback, settings) => {
  window.setTimeout(function () {
    const topCards = $(`.${topCardClassName}`);

    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      callback(topCard, settings);
    } else {
      waitForTopCard(callback, settings);
    }
  }, 500);
}

export const createELKeywords: CreateELKeywords = (years, keywords) => {
  if (years === 15) return keywords;

  suffixes.forEach(s => keywords.push(years + s));
  const nextYear = years + 1 as Years;
  return createELKeywords(nextYear, keywords);
}

export const createFlag = (keywords: string[]) => {
  const topCard = $(`.${topCardClassName}`)[0];
  const newHTML = `&#129313;`;

  topCard.append(newHTML);
}
