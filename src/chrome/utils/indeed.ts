import $ from 'jquery';
import { WaitForPill } from '../../types';


const pillListClassName = 'filter-explvl';

// Wait for entry level element to load before scanning job
export const waitForPill: WaitForPill = (scanJob, settings, count) => {
  // Call scanJob if not found after 2 seconds
  if (count === 4) return scanJob('', settings, 'indeed');

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
