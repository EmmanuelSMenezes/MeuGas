export const formatDate = (date: string | Date): string => {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR');

  return formattedDate;
}
