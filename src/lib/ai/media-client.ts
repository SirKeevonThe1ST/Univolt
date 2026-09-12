const MAX_DIM = 1280;
const MAX_BYTES = 1_800_000;
const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export function isAllowedImage(file: File): string | null {
  const type = file.type.toLowerCase();
  if (!ALLOWED.has(type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    return "Please choose a JPG, PNG, or WEBP image.";
  }
  if (file.size > 8 * 1024 * 1024) {
    return "This file is too large. Please choose a smaller image.";
  }
  return null;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export async function resizeImageFile(file: File): Promise<{ name: string; dataUrl: string; mime: string }> {
  const err = isAllowedImage(file);
  if (err) throw new Error(err);

  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { name: file.name, dataUrl, mime: file.type || "image/jpeg" };
  ctx.drawImage(img, 0, 0, w, h);

  let quality = 0.72;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (out.length > MAX_BYTES && quality > 0.4) {
    quality -= 0.1;
    out = canvas.toDataURL("image/jpeg", quality);
  }
  return { name: file.name.replace(/\.[^.]+$/, "") + ".jpg", dataUrl: out, mime: "image/jpeg" };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image could not be read."));
    img.src = src;
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
