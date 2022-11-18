import { WaitForTopCard } from "../types";

// Wait for entry-level element to load
export const waitForTopCard: WaitForTopCard = (callback, settings) => {
  window.setTimeout(function () {
    const topCardClassName = "jobs-unified-top-card__job-insight";
    const topCards = document.getElementsByClassName(topCardClassName);

    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      callback(topCard, settings);
    } else {
      waitForTopCard(callback, settings);
    }
  }, 500);
}
