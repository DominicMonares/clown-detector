import $ from 'jquery';
import { joinKeywords } from './shared';
import { WaitForPill } from '../../types';


// Wait for entry level element to load before scanning job
export const waitForPill: WaitForPill = (scanJob, settings, count) => {
  // Call scanJob if not found after 4 seconds
  if (count === 8) return scanJob('', settings, 'indeed');

  setTimeout(() => {
    const pill = $(`#filter-explvl`);
    if (pill.length) {
      const experience = pill[0]['children'][0]['innerHTML'];
      return scanJob(experience, settings, 'indeed');

    } else {
      return waitForPill(scanJob, settings, count + 1);
    }
  }, 500);
}

// Highlight keywords and render new description
export const renderIndeedDescription = (keywords: string[], job: string) => {
  const jobDiv = $('#jobDescriptionText');

  // NEED CLEANUP METHOD
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
  const joinedKeywords = joinKeywords(keywords);
  const salaryInfoContainer = $('#salaryInfoAndJobType')[0];
  const salaryInfoLength = salaryInfoContainer['children'].length;
  const lastElement = salaryInfoContainer['children'][salaryInfoLength - 1];
  if (lastElement.innerHTML.includes('🤡')) return; // Prevent duplicate renders

  const clown = '<span style="font-size: 17px">🤡</span>';
  const flag = `${clown}\xa0\xa0${joinedKeywords}`;
  const newLastElement = lastElement.innerHTML + flag;
  $('#salaryInfoAndJobType')[0]['children'][salaryInfoLength - 1]['innerHTML'] = newLastElement;
}
