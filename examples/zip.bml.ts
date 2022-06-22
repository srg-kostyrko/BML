//https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT

import {
  greedyArray,
  struct,
  constant,
  endian,
  Endian,
  string,
  uint16,
  branch,
  ctx,
  uint32,
  bytes,
  enums,
  Encoding,
  array,
  int32,
  encoding,
  pointer,
  TagProducer,
  lazyBound,
} from '../src';

const u1 = uint16;
const u2 = uint16;
const u4 = uint32;
const s4 = int32;
const compression = enums(u2, {
  none: 0,
  shrunk: 1,
  reduced1: 2,
  reduced2: 3,
  reduced3: 4,
  reduced4: 5,
  imploded: 6,
  deflated: 8,
  enhancedDeflated: 9,
  pkwareDclImploded: 10,
  bzip2: 12,
  lzma: 14,
  ibmTerse: 18,
  ibmLz77Z: 19,
  ppmd: 98,
});

const extraCodes = enums(u2, {
  zip64: 0x0001,
  avInfo: 0x0007,
  os2: 0x0009,
  ntfs: 0x000a,
  openvms: 0x000c,
  pkwareUnix: 0x000d,
  fileStreamAndForkDescriptors: 0x000e,
  patchDescriptor: 0x000f,
  pkcs7: 0x0014,
  x509CertIdAndSignatureForFile: 0x0015,
  x509CertIdForCentralDir: 0x0016,
  strongEncryptionHeader: 0x0017,
  recordManagementControls: 0x0018,
  pkcs7EncRecipCertList: 0x0019,
  ibmS390Uncomp: 0x0065,
  ibmS390Comp: 0x0066,
  poszip4690: 0x4690,
  extendedTimestamp: 0x5455,
  infozipUnix: 0x7855,
  infozipUnixVarSize: 0x7875,
});

// eslint-disable-next-line prefer-const
let pkSection: TagProducer<unknown>;

const extendedTimestamp = struct(
  u1`flags`,
  u4`mod_time`,
  u4`access_time`,
  u4`create_time`
);

const infozipUnixVarSize = struct(
  u1`version`,
  u1`uid_size`,
  bytes(ctx`uid_size`)`uid`,
  u1`gid_size`,
  bytes(ctx`gid_size`)`gid`
);

const extraField = struct(
  extraCodes`code`,
  u2`size`,
  branch(
    ctx`type`,
    {
      // ntfs: ntfs,
      extendedTimestamp: extendedTimestamp,
      infozipUnixVarSize: infozipUnixVarSize,
    },
    bytes(ctx`size`)
  )`body`
);

const centralDirEntry = struct(
  u2`version_made_by`,
  u2`version_needed_to_extract`,
  u2`flags`,
  compression`compression_method`,
  u2`last_mod_file_time`,
  u2`last_mod_file_date`,
  u4`crc32`,
  u4`compressed_size`,
  u4`uncompressed_size`,
  u2`file_name_len`,
  u2`extra_len`,
  u2`comment_len`,
  u2`disk_number_start`,
  u2`int_file_attr`,
  u4`ext_file_attr`,
  s4`local_header_offset`,
  string(ctx`file_name_len`)`file_name`,
  array(extraField, ctx`extra_len`)`extras`,
  string(ctx`comment_len`)`comment`,
  pointer(
    ctx`local_header_offset`,
    lazyBound(() => pkSection)
  )`local_header`
);

const endOfCentralDir = struct(
  u2`disk_of_end_of_central_dir`,
  u2`disk_of_central_dir`,
  u2`qty_central_dir_entries_on_disk`,
  u2`qty_central_dir_entries_total`,
  u4`central_dir_size`,
  u4`central_dir_offset`,
  u2`comment_len`,
  string(ctx`comment_len`)`comment`
);

const localFileHeader = struct(
  u2`version`,
  u2`flags`,
  compression`compression_method`,

  u2`file_mod_time`,
  u2`file_mod_date`,
  u4`crc32`,
  u4`compressed_size`,
  u4`uncompressed_size`,
  u2`file_name_len`,
  u2`extra_len`,
  string(ctx`file_name_len`, Encoding.utf8)`file_name`,
  array(extraField, ctx`extra_len`)`extras`
);

const localFile = struct(
  localFileHeader`header`,
  bytes(ctx`header.compressed_size`)`body`
);

const dataDescriptor = struct(
  u4`crc32`,
  u4`compressed_size`,
  u4`uncompressed_size`
);

pkSection = struct(
  constant(string(2), 'PK'),
  enums(u2, {
    centralDirEntry: 0x0201,
    localFile: 0x0403,
    endOfCentralDir: 0x0605,
    dataDescriptor: 0x0807,
  })`section_type`,
  branch(ctx`section_type`, {
    centralDirEntry,
    localFile,
    endOfCentralDir,
    dataDescriptor,
  })`body`
);

export const zipFile = struct(
  endian(Endian.LE),
  encoding(Encoding.utf8),
  greedyArray(pkSection)`sections`
);
