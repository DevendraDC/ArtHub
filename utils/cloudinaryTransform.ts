export function cloudinaryTransform(url: string, transformation: string) {
  return url.replace("/upload/", `/upload/${transformation}/`);
}