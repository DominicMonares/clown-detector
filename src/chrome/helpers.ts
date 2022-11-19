import $ from 'jquery';
import { Years, WaitForTopCard } from "../types";
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

export const createELKeywords = (entryLevel: Years, keywords: string[]) => {
  const years = entryLevel;
  // let count = entryLevel;
  // const keywords = suffixes.reduce(
  //   (previousValue, currentValue) => {
  //     return previousValue.push(currentValue);
  //   },
  //   [] as string[]
  // );



  // while (count < 15) {
  //   const newKeywords = suffixes.map(s => (count + 2) + s);
  //   keywords.push(newKeywords);
  //   count++;
  // }

  if (years === 15) return keywords;

  return keywords.flat();
}

export const createFlag = (keywords: string[]) => {
  const topCard = $(`.${topCardClassName}`)[0];
  const newHTML = `&#129313;`;

  topCard.append(newHTML);
}
