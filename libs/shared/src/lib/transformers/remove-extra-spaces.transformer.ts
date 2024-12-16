// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const removeExtraSpaces = ({ value }) => {
  return value.replace(/\s+/g, ' ').trim();
};
