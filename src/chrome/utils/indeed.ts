import $ from 'jquery';
import { WaitForPill } from '../../types';


const pillListClassName = 'filter-explvl';

// Wait for entry level element to load before scanning job
export const waitForPill: WaitForPill = (scanJob, settings, count) => {
  if (count === 10) return; // Exit if not found after 10 seconds
  setTimeout(() => {
    const pillList = $(`#${pillListClassName}`);
    if (pillList.length) {

      const topCard = pillList[0]['children'][0]['innerHTML'];
      return scanJob(topCard, settings);

    } else {
      return waitForPill(scanJob, settings, count + 1);
    }
  }, 500);
}