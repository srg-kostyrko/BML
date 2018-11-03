const INT8 = 'int8';
const UINT8 = 'uint8';
const INT16 = 'int16';
const UINT16 = 'uint16';
const INT32 = 'int32';
const UINT32 = 'uint32';
const FLOAT32 = 'float32';
const FLOAT64 = 'float64';

const typeSettings = {
  [INT8]: {
    read: 'getInt8',
    write: 'setInt8',
    size: Int8Array.BYTES_PER_ELEMENT,
  },
  [UINT8]: {
    read: 'getUint8',
    write: 'setUint8',
    size: Uint8Array.BYTES_PER_ELEMENT,
  },
  [INT16]: {
    read: 'getInt16',
    write: 'setInt16',
    size: Int16Array.BYTES_PER_ELEMENT,
  },
  [UINT16]: {
    read: 'getUint16',
    write: 'setUint16',
    size: Uint16Array.BYTES_PER_ELEMENT,
  },
  [INT32]: {
    read: 'getInt32',
    write: 'setInt32',
    size: Int32Array.BYTES_PER_ELEMENT,
  },
  [UINT32]: {
    read: 'getUint32',
    write: 'setUint32',
    size: Uint32Array.BYTES_PER_ELEMENT,
  },
  [FLOAT32]: {
    read: 'getFloat32',
    write: 'setFloat32',
    size: Float32Array.BYTES_PER_ELEMENT,
  },
  [FLOAT64]: {
    read: 'getFloat64',
    write: 'setFloat64',
    size: Float64Array.BYTES_PER_ELEMENT,
  },
};

module.exports = {
  INT8,
  UINT8,
  INT16,
  UINT16,
  INT32,
  UINT32,
  FLOAT32,
  FLOAT64,
  typeSettings,
};
