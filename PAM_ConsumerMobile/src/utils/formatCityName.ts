export const formatCityName = (name: string) => {
  const itsComposed = name.split("").reduce((accumulator, currentValue) => {
    return currentValue === " " ? accumulator + 1 : accumulator;
  }, 0);
  if (itsComposed < 2) return name;

  const [first, second, third] = name.split(" ");

  return `${first[0] + second[0] + third[0]}`.toUpperCase()
};
