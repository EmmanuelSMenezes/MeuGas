export const formatValidityCard = (validity: string) => {
  const [expirationMonth, expirationYear] = validity?.split("/");
  return `${expirationMonth}/${expirationYear?.slice(
    2,
    expirationYear.length
  )}`;
};
