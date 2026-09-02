export const positions = [
  { value: "GK", label: "GOLEIRO" },
  { value: "CB", label: "ZAGUEIRO" },
  { value: "FB", label: "LATERAL" },
  { value: "WB", label: "ALA" },
  { value: "CDM", label: "VOLANTE" },
  { value: "CM", label: "MEIA CENTRAL" },
  { value: "CAM", label: "MEIA OFENSIVO" },
  { value: "W", label: "PONTA" },
  { value: "CF", label: "SEGUNDO ATACANTE" },
  { value: "ST", label: "CENTROAVANTE" },
] as const;

export const shirtSizes = ["PP", "P", "M", "G", "GG", "XGG"] as const;

export type Position = (typeof positions)[number]["value"];
export type ShirtSize = (typeof shirtSizes)[number];

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export const maxPhotoSize = 5 * 1024 * 1024;

export function getPhotoExtension(file: File) {
  return allowedMimeTypes.get(file.type);
}

export async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (file.type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (file.type === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (file.type === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }

  return false;
}
