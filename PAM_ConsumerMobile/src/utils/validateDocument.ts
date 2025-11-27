const CNPJ_BLACKLIST: Array<string> = [
  "00000000000000",
  "11111111111111",
  "22222222222222",
  "33333333333333",
  "44444444444444",
  "55555555555555",
  "66666666666666",
  "77777777777777",
  "88888888888888",
  "99999999999999",
];

const CPF_BLACKLIST: Array<string> = [
  "00000000000",
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "66666666666",
  "77777777777",
  "88888888888",
  "99999999999",
  "12345678909",
];

const STRICT_STRIP_REGEX: RegExp = /[.-]/g;
const LOOSE_STRIP_REGEX: RegExp = /[^\d]/g;

const strip = (number: string, strict?: boolean): string => {
  const regex: RegExp = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
  return (number || "").replace(regex, "");
};

const verifierCNPJDigit = (digits: string): number => {
  let index: number = 2;
  const reverse: Array<number> = digits.split("").reduce((buffer, number) => {
    return [parseInt(number, 10)].concat(buffer);
  }, []);

  const sum: number = reverse.reduce((buffer, number) => {
    buffer += number * index;
    index = index === 9 ? 2 : index + 1;
    return buffer;
  }, 0);

  const mod: number = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
};

const verifierCPFDigit = (digits: string): number => {
  const numbers: Array<number> = digits.split("").map((number) => {
    return parseInt(number, 10);
  });

  const modulus: number = numbers.length + 1;
  const multiplied: Array<number> = numbers.map(
    (number, index) => number * (modulus - index)
  );
  const mod: number =
    multiplied.reduce((buffer, number) => buffer + number) % 11;

  return mod < 2 ? 0 : 11 - mod;
};

export const validateCPF = (number: string, strict?: boolean): boolean => {
  const stripped: string = strip(number, strict);

  // CPF must be defined
  if (!stripped) {
    return false;
  }

  // CPF must have 11 chars
  if (stripped.length !== 11) {
    return false;
  }

  // CPF can't be blacklisted
  if (CPF_BLACKLIST.includes(stripped)) {
    return false;
  }

  let numbers: string = stripped.substr(0, 9);
  numbers += verifierCPFDigit(numbers);
  numbers += verifierCPFDigit(numbers);

  return numbers.substr(-2) === stripped.substr(-2);
};

export const validateCNPJ = (number: string, strict?: boolean): boolean => {
  const stripped: string = strip(number, strict);

  // CNPJ must be defined
  if (!stripped) {
    return false;
  }

  // CNPJ must have 14 chars
  if (stripped.length !== 14) {
    return false;
  }

  // CNPJ can't be blacklisted
  if (CNPJ_BLACKLIST.includes(stripped)) {
    return false;
  }

  let numbers: string = stripped.substr(0, 12);
  numbers += verifierCNPJDigit(numbers);
  numbers += verifierCNPJDigit(numbers);

  return numbers.substr(-2) === stripped.substr(-2);
};
