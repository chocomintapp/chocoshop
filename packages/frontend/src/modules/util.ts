export const shortenAddress = (rawAddress: string): string => {
  const pre = rawAddress.substring(0, 4);
  const post = rawAddress.substring(39);
  return `${pre}...${post}`;
};

export const shortenText = (text: string, length: number): string => {
  if (text.length > length) {
    const shortendText = text.substring(0, length);
    return `${shortendText}...`;
  }
  return text;
};
