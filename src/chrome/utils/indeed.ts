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
export const renderIndeedDescription = (keywords: string[]) => {
  const jobDiv = $('#jobDescriptionText');
  let jobHTML = jobDiv[0]['innerHTML'];

  keywords.forEach(k => {
    const keyword = k.replace('+', '\\+');
    const regex = new RegExp(keyword, 'ig');
    jobHTML = jobHTML.replace(regex, `<mark>${k}</mark>`);
  });

  jobDiv.children().hide(); // Hide instead of remove to preserve events
  jobDiv.append(`<span>${jobHTML}</span>`);
}

// Send in the clowns!
export const renderIndeedFlags = (keywords: string[]) => {
  const joinedKeywords = joinKeywords(keywords);
  const salary = $('.jobsearch-JobMetadataHeader-item ')[0];
  const jobContainer = $('.jobsearch-CompanyInfoContainer')[0];

  // const salaryInfoLength = jobContainer['children'].length;
  // const lastElement = jobContainer['children'][salaryInfoLength - 1];
  const alreadyClowned = salary.innerHTML.includes('🤡') || jobContainer.innerHTML.includes('🤡');
  if (alreadyClowned) return; // Prevent duplicate renders

  const clown = '<span style="font-size: 17px">🤡</span>';
  const flag = `${clown}\xa0\xa0${joinedKeywords}`;
  const newHtml = $.parseHTML(`<div>${flag}</div>`);
  if (salary) {
    salary.append(newHtml[0]);
  } else {
    jobContainer.append(newHtml[0]);
  }

}
