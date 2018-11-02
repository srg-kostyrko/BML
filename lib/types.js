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
    size: 1,
  },
  [UINT8]: {
    read: 'getUint8',
    write: 'setUint8',
    size: 1,
  },
  [INT16]: {
    read: 'getInt16',
    write: 'setInt16',
    size: 2,
  },
  [UINT16]: {
    read: 'getUint16',
    write: 'setUint16',
    size: 2,
  },
  [INT32]: {
    read: 'getInt32',
    write: 'setInt32',
    size: 4,
  },
  [UINT32]: {
    read: 'getUint32',
    write: 'setUint32',
    size: 4,
  },
  [FLOAT32]: {
    read: 'getFloat32',
    write: 'setFloat32',
    size: 4,
  },
  [FLOAT64]: {
    read: 'getFloat64',
    write: 'setFloat64',
    size: 8,
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
