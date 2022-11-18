import $ from 'jquery';
import { WaitForTopCard } from "../types";


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

export const createFlag = (keywords: string[]) => {
  const topCard = $(`.${topCardClassName}`)[0];
  const newHTML = `&#129313;`;

  topCard.append(newHTML);
}
