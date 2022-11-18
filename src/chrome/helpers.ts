export const waitForTopCard = (callback: (topCard: string) => void) => {
  window.setTimeout(function () {
    const topCardClassName = "jobs-unified-top-card__job-insight";
    const topCards = document.getElementsByClassName(topCardClassName);

    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      callback(topCard);
    } else {
      waitForTopCard(callback);
    }
  }, 500);
}
