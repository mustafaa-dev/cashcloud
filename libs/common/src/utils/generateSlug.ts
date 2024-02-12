import slugify from 'slugify';

export async function generateSlug(name: string) {
  const timestamp = new Date().getTime().toString().slice(7, 11);
  const base = slugify(name, { lower: true, strict: true });
  return `${base}-${timestamp}`;
}
