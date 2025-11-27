export const formatCardNumber = (number: string | number) => {
  const cardNumber = `${number}`;

  return (
    cardNumber
      .slice(0, cardNumber.length - 8)
      .split(" ")
      .map(() => "****")
      .join(" ") +
    " " +
    cardNumber.slice(cardNumber.length - 4, cardNumber.length)
  );
};
