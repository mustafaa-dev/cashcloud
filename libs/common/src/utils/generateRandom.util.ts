export const generateNumber = async function generateRandomNumber(
  length: number,
): Promise<number> {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
