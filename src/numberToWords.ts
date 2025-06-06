export const numberToWords = (num: number): string => {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const hundreds = [
    "",
    "one hundred",
    "two hundred",
    "three hundred",
    "four hundred",
    "five hundred",
    "six hundred",
    "seven hundred",
    "eight hundred",
    "nine hundred",
  ];

  if (num === 0) return "zero";
  if (num < 20) return ones[num];
  if (num < 100) {
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    return onesDigit === 0
      ? tens[tensDigit]
      : `${tens[tensDigit]}-${ones[onesDigit]}`;
  }
  if (num < 1000) {
    const hundredsDigit = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return hundreds[hundredsDigit];
    if (remainder < 20) return `${hundreds[hundredsDigit]} ${ones[remainder]}`;
    const tensDigit = Math.floor(remainder / 10);
    const onesDigit = remainder % 10;
    return onesDigit === 0
      ? `${hundreds[hundredsDigit]} ${tens[tensDigit]}`
      : `${hundreds[hundredsDigit]} ${tens[tensDigit]}-${ones[onesDigit]}`;
  }

  return num.toString();
};
