import $ from 'jquery';
import { joinKeywords } from './shared';
import { WaitForPill } from '../../types';


const pillListClassName = 'filter-explvl';

// Wait for entry level element to load before scanning job
export const waitForPill: WaitForPill = (scanJob, settings, count) => {
  // Call scanJob if not found after 4 seconds
  if (count === 8) return scanJob('', settings, 'indeed');

  setTimeout(() => {
    const pillList = $(`#${pillListClassName}`);
    if (pillList.length) {
      const pill = pillList[0]['children'][0]['innerHTML'];
      return scanJob(pill, settings, 'indeed');

    } else {
      return waitForPill(scanJob, settings, count + 1);
    }
  }, 500);
}

// Highlight keywords and render new description
export const renderIndeedDescription = (keywords: string[], job: string) => {
  const jobDiv = $('#jobDescriptionText');

  keywords.forEach(k => {
    const keyword = k.replace('+', '\\+');
    const regex = new RegExp(keyword, 'ig');
    job = job.replace(regex, `<mark>${k}</mark>`);
  });

  jobDiv.children().hide(); // Hide instead of remove to preserve events
  jobDiv.append(`<span>${job}</span>`);
}

// Send in the clowns!
export const renderIndeedFlags = (keywords: string[]) => {
  // const joinedKeywords = joinKeywords(keywords);
  // const spacer = '<!---->';
  // const topHTML = $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'];
  // if (topHTML.includes('🤡')) return; // Prevent duplicate renders

  // const splitTop = topHTML.split(spacer);
  // const textEnd = splitTop.length - 2;
  // const clown = '<span style="font-size: 17px">🤡</span>';
  // const newTop = `${splitTop[textEnd]}\xa0\xa0${clown}\xa0\xa0${joinedKeywords}`;
  // splitTop[textEnd] = newTop;
  // $(`.${topCardClassName}`)[0]['children'][1]['innerHTML'] = splitTop.join(spacer);
}
