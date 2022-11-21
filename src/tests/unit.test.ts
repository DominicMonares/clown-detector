import { replaceApostrophes, createELKeywords } from "../chrome/utils";


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
      const combos = ['5 years', '6+ yrs', '7 +yrs', '9 +years', '11+ years', '13 yrs', '15+years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(true);
    });

    it ('should only render up to 15 years', () => {
      const combos = ['5 years', '6+ yrs', '7 +yrs', '9 +years', '11+ years', '13 yrs', '16+years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(false);
    });

    it('should not render years below threshold', () => {
      const combos = ['3 years', '6+ yrs', '7 +yrs', '9 +years', '11+ years', '13 yrs', '15+years'];
      const output = createELKeywords(5, []);
      const result = combos.every(c => output.includes(c) ? true : false);
      expect(result).toBe(false);
    })
  });
});
