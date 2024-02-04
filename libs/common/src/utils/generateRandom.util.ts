import { v4 as uuidv4 } from 'uuid';

export const generateNumber = async function generateRandomNumber(
  len: number,
): Promise<number> {
  const randomUUID = uuidv4();
  const randomPart = randomUUID.replace(/-/g, '');
  const timestamp = new Date().getTime().toString();
  return parseInt((timestamp + randomPart).slice(0, len));
};
