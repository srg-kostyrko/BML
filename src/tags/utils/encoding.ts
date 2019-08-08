import { Encoding } from '../../contracts';

export const encoders: Record<
  Encoding,
  {
    encode: (input: string) => number[];
    decode: (input: number[]) => string;
  }
> = {
  [Encoding.ascii]: {
    encode: (input: string) =>
      input.split('').map((char): number => char.charCodeAt(0)),
    decode: (input: number[]) => String.fromCharCode(...input),
  },
  [Encoding.utf8]: {
    encode: (input: string) => {
      const bytes = [];
      for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        if (charCode < 128) {
          bytes.push(charCode);
        } else if (charCode < 2048) {
          bytes.push((charCode >> 6) | 192, (charCode & 63) | 128);
        } else if (
          (charCode & 0xfc00) == 0xd800 &&
          i + 1 < input.length &&
          (input.charCodeAt(i + 1) & 0xfc00) == 0xdc00
        ) {
          // Surrogate Pair
          charCode =
            0x10000 +
            ((charCode & 0x03ff) << 10) +
            (input.charCodeAt(++i) & 0x03ff);
          bytes.push(
            (charCode >> 18) | 240,
            ((charCode >> 12) & 63) | 128,
            ((charCode >> 6) & 63) | 128,
            (charCode & 63) | 128
          );
        } else {
          bytes.push(
            (charCode >> 12) | 224,
            ((charCode >> 6) & 63) | 128,
            (charCode & 63) | 128
          );
        }
      }
      return bytes;
    },

    decode: (input: number[]) => {
      let out = '';
      let pos = 0;
      while (pos < input.length) {
        const c1 = input[pos++];
        if (c1 < 128) {
          out += String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
          const c2 = input[pos++];
          out += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        } else if (c1 > 239 && c1 < 365) {
          // Surrogate Pair
          const c2 = input[pos++];
          const c3 = input[pos++];
          const c4 = input[pos++];
          const u =
            (((c1 & 7) << 18) |
              ((c2 & 63) << 12) |
              ((c3 & 63) << 6) |
              (c4 & 63)) -
            0x10000;
          out +=
            String.fromCharCode(0xd800 + (u >> 10)) +
            String.fromCharCode(0xdc00 + (u & 1023));
        } else {
          const c2 = input[pos++];
          const c3 = input[pos++];
          out += String.fromCharCode(
            ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
          );
        }
      }
      return out;
    },
  },
  [Encoding.utf16be]: {
    encode: (input: string) => {
      const charCodes = input
        .split('')
        .map((char): number => char.charCodeAt(0));
      const buffer = new ArrayBuffer(charCodes.length * 2);
      const view = new DataView(buffer);
      for (const [index, point] of charCodes.entries()) {
        view.setUint16(index * 2, point);
      }
      return [...new Uint8Array(view.buffer)];
    },
    decode: (input: number[]) => {
      const buffer = new Uint8Array(input).buffer;
      const view = new DataView(buffer);
      const codePoints = [];
      for (let index = 0; index < input.length; index += 2) {
        codePoints.push(view.getUint16(index));
      }
      return String.fromCharCode(...codePoints);
    },
  },
  [Encoding.utf16le]: {
    encode: (input: string) => {
      const charCodes = input
        .split('')
        .map((char): number => char.charCodeAt(0));
      const buffer = new ArrayBuffer(charCodes.length * 2);
      const view = new DataView(buffer);
      for (const [index, point] of charCodes.entries()) {
        view.setUint16(index * 2, point, true);
      }
      return [...new Uint8Array(view.buffer)];
    },
    decode: (input: number[]) => {
      const buffer = new Uint8Array(input).buffer;
      const view = new DataView(buffer);
      const codePoints = [];
      for (let index = 0; index < input.length; index += 2) {
        codePoints.push(view.getUint16(index, true));
      }
      return String.fromCharCode(...codePoints);
    },
  },
};
