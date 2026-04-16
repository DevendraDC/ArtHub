export function cloudinaryTransform(url: string, size: string) {
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${size},c_limit/`);
}