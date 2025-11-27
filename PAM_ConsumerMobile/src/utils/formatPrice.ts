export const formatPrice = (price: number, prefix: string = "R$ "): string => {
  const newPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const [_, formattedPrice] = newPrice.split("R$");

  return prefix + formattedPrice.trim();
};
