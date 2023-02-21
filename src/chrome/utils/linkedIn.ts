import $ from 'jquery';
import { joinKeywords } from './shared';
import { WaitForTopCard } from "../../types";


const topCardClassName = "jobs-unified-top-card__job-insight";

// Wait for entry level element to load before scanning job
export const waitForTopCard: WaitForTopCard = (scanJob, settings, count) => {
  // Exit if not found after 5 seconds
  // Does not call scan job like the Indeed equivalent because all LinkedIn
  // jobs contain a topcard, not every Indeed job contains a pill (topcard equivalent)
  if (count === 10) return;

  setTimeout(() => {
    const topCards = $(`.${topCardClassName}`);
    if (topCards.length) {
      const topCard = topCards[0]['children'][1]['innerHTML'];
      return scanJob(topCard, settings, 'linkedIn');
    } else {
      return waitForTopCard(scanJob, settings, count + 1);
    }
  }, 500);
}

// Highlight keywords and render new description
export const renderLinkedInDescription = (keywords: string[], sourced: number) => {
  const jobSpan = $('#job-details span');

  // Clear unused DOM elements to reduce pollution
  if (jobSpan.length >= 6) {
    let count = jobSpan.length - 1;
    while (count >= 6) {
      if (!jobSpan[count].nextSibling) {
        $('#job-details span')[count].remove();
        count--;
      } else {
        count--;
      }
    }
  }

  // Remove jobs sourced from external job board
  const sourcedDiv = $('#job-details div')[0];
  if (sourcedDiv) $('#job-details div')[0].remove();

  // Highlight flagged words
  let jobHTML = jobSpan[sourced].innerHTML;
  keywords.forEach(k => {
    const keyword = k.replace('+', '\\+');
    const regex = new RegExp(keyword, 'ig');
    jobHTML = jobHTML.replace(regex, `<mark>${k}</mark>`);
  });

  // Render
  $('#job-details span').hide(); // Hide instead of remove to preserve events
  $('#job-details').append(`<span>${jobHTML}</span>`);
}

// Send in the clowns!
export const renderLinkedInFlags = (keywords: string[]) => {
  const joinedKeywords = joinKeywords(keywords);
  const spacer = '<!---->';
  const topHTML = $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'];
  if (topHTML.includes('🤡')) return; // Prevent duplicate renders

  const splitTop = topHTML.split(spacer);
  const textEnd = splitTop.length - 2;
  const clown = '<span style="font-size: 17px">🤡</span>';
  const newTop = `${splitTop[textEnd]}\xa0\xa0${clown}\xa0\xa0${joinedKeywords}`;
  splitTop[textEnd] = newTop;
  if (keywords.length) {
    $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'] = splitTop.join(spacer);
  }
}
