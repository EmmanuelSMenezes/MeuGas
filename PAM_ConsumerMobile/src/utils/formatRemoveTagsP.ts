export function removeTagsP(text: string) {
  if (text) return text;

  return text.match(/<p>.*?<\/p>/g)?.map((x) => x.slice(3, -4));
}
