import { inflate } from 'pako';

function base64ToBytes(base64: string) {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function readUint32(bytes: Uint8Array, offset: number) {
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

/** Average red channel from a small PNG (base64, no data-url prefix). */
export function averageRedFromPngBase64(base64: string): number | null {
  try {
    const bytes = base64ToBytes(base64.replace(/^data:image\/png;base64,/, ''));
    if (bytes.length < 24) return null;
    if (bytes[0] !== 0x89 || bytes[1] !== 0x50) return null;

    let offset = 8;
    let width = 0;
    let height = 0;
    let bitDepth = 8;
    let colorType = 2;
    const idat: number[] = [];

    while (offset + 8 <= bytes.length) {
      const length = readUint32(bytes, offset);
      const type = String.fromCharCode(
        bytes[offset + 4],
        bytes[offset + 5],
        bytes[offset + 6],
        bytes[offset + 7]
      );
      const start = offset + 8;
      const end = start + length;
      if (end + 4 > bytes.length) break;

      if (type === 'IHDR') {
        width = readUint32(bytes, start);
        height = readUint32(bytes, start + 4);
        bitDepth = bytes[start + 8];
        colorType = bytes[start + 9];
      } else if (type === 'IDAT') {
        for (let i = start; i < end; i += 1) idat.push(bytes[i]);
      } else if (type === 'IEND') {
        break;
      }

      offset = end + 4;
    }

    if (!width || !height || !idat.length) return null;
    if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) return null;

    const inflated = inflate(new Uint8Array(idat));
    const channels = colorType === 6 ? 4 : 3;
    const stride = 1 + width * channels;
    let sum = 0;
    let count = 0;

    for (let y = 0; y < height; y += 1) {
      const rowStart = y * stride + 1;
      for (let x = 0; x < width; x += 1) {
        sum += inflated[rowStart + x * channels];
        count += 1;
      }
    }

    return count ? sum / count : null;
  } catch {
    return null;
  }
}
