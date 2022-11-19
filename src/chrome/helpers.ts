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

export const replaceApostrophes = (keywords: string[]) => {
  return keywords.map(k => {
    return k.includes("'") ? k.split('').map(v => v === "'" ? '’' : v).join('') : k;
  });
}

export const createELKeywords: CreateELKeywords = (years, keywords) => {
  suffixes.forEach(s => keywords.push(years + s));
  const nextYear = years + 1 as Years;
  return years === 15 ? keywords : createELKeywords(nextYear, keywords);
}

export const createFlag = (keywords: string[]) => {
  const joinedKeywords = (keywords.map((k, i) => {
    return i === keywords.length - 1 ? k : k + ' · ';
  })).join('');

  const topCard = $(`.${topCardClassName}`).first();
  const newHTML = $(`
    <div style="display:flex; align-items:center; margin-left:12px;">
      <font size="5" style="margin-right:10px">&#129313;</font>
      <span>${joinedKeywords}</span>
    </div>
  `);

  topCard.append(newHTML);
}
