export const formatDistance = (distance: number): string => {
  const [kilometers, metres] = distance.toString().split(".").map(Number);

  const result =
    kilometers > 0
      ? `${kilometers.toFixed(1).replace(".", ",")} km`
      : `${(distance * 1000).toFixed(0)} m`;

  return result.replace(".", ",");
};
