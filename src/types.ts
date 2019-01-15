import { DataType } from './contracts';

export const typeSettings = {
  [DataType.int8]: {
    read: (view: DataView, byteOffset: number) => view.getInt8(byteOffset),
    write: (view: DataView, byteOffset: number, value: number) =>
      view.setInt8(byteOffset, value),
    size: Int8Array.BYTES_PER_ELEMENT,
  },
  [DataType.uint8]: {
    read: (view: DataView, byteOffset: number) => view.getUint8(byteOffset),
    write: (view: DataView, byteOffset: number, value: number) =>
      view.setUint8(byteOffset, value),
    size: Uint8Array.BYTES_PER_ELEMENT,
  },
  [DataType.int16]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getInt16(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setInt16(byteOffset, value, littleEndian),
    size: Int16Array.BYTES_PER_ELEMENT,
  },
  [DataType.uint16]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getUint16(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setUint16(byteOffset, value, littleEndian),
    size: Uint16Array.BYTES_PER_ELEMENT,
  },
  [DataType.int32]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getInt32(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setInt32(byteOffset, value, littleEndian),
    size: Int32Array.BYTES_PER_ELEMENT,
  },
  [DataType.uint32]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getUint32(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setUint32(byteOffset, value, littleEndian),
    size: Uint32Array.BYTES_PER_ELEMENT,
  },
  [DataType.float32]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getFloat32(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setFloat32(byteOffset, value, littleEndian),
    size: Float32Array.BYTES_PER_ELEMENT,
  },
  [DataType.float64]: {
    read: (view: DataView, byteOffset: number, littleEndian: boolean) =>
      view.getFloat64(byteOffset, littleEndian),
    write: (
      view: DataView,
      byteOffset: number,
      value: number,
      littleEndian: boolean
    ) => view.setFloat64(byteOffset, value, littleEndian),
    size: Float64Array.BYTES_PER_ELEMENT,
  },
};
