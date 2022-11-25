import {
  checkPrefixes,
  createELKeywords,
  replaceApostrophes
} from "../chrome/utils";


describe('Chrome Utils', () => {
  describe('replaceApostrophes', () => {
    it('should replace single quotes with apostrophes', () => {
      const input = ["That's", "Bobby's", "purse!"];
      const expected = ["That’s", "Bobby’s", "purse!"];
      expect(replaceApostrophes(input)).toStrictEqual(expected);
    });

    it('should leave existing apostrophes in place', () => {
      const inputExpected = ["That’s", "Bobby’s", "purse!"];
      expect(replaceApostrophes(inputExpected)).toStrictEqual(inputExpected);
    });
  });

  describe('createELKeywords', () => {
    it('should return an array of year/suffix combinations within range', () => {
      const combos = ['5 years', '6+ yrs', '7 +yrs', '9 +years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(true);
    });

    it ('should only render up to 9 years', () => {
      const combos = ['5 years', '6+ yrs', '7 +yrs', '9 +years', '11+ years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(false);
    });

    it('should not render years below threshold', () => {
      const combos = ['3 years', '6+ yrs', '7 +yrs', '9 +years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(false);
    });
  });

  describe('checkPrefixes', () => {
    it('should return keyword if found in job', () => {
      const job = '<li>Requires 7 years of experience</li>;'
      const keyword = '7 years';
      const output = checkPrefixes(job, keyword);
      expect(output).toBe('7 years');
    });

    it('should return undefined if job does not contain keyword', () => {
      const job = '<li>Requires 2 years of experience</li>';
      const keyword = '7 years';
      const output = checkPrefixes(job, keyword);
      expect(output).toBeUndefined();
    });

    it('should return a range if it exists', () => {
      const job = '<li>4-5 years of experience required</li>';
      const keyword = '5 years';
      const output = checkPrefixes(job, keyword);
      expect(output).toBe('4-5 years');
    });

    it('should return undefined if single double digit found in job', () => {
      const job = 'For more than 35 years, we have...';
      const keyword = '5 years';
      const output = checkPrefixes(job, keyword);
      expect(output).toBeUndefined();
    });

    it('should return keyword if entry level found after double digit', () => {
      const job = 'For more than 35 years, we have required 5 years of experience for entry level jobs';
      const keyword = '5 years';
      const output = checkPrefixes(job, keyword);
      expect(output).toBe('5 years');
    });
  })
});
