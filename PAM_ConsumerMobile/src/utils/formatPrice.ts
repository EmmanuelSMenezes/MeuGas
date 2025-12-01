export const formatPrice = (price: number | undefined, prefix: string = "R$ "): string => {
  // Se price for undefined ou null, retornar R$ 0,00
  if (price === undefined || price === null || isNaN(price)) {
    return prefix + "0,00";
  }

  const newPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const [_, formattedPrice] = newPrice.split("R$");

  return prefix + formattedPrice.trim();
};
