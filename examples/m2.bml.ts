// https://wowdev.wiki/M2

import {
  float,
  int16,
  int32,
  uint8,
  uint16,
  uint32,
  array,
  struct,
  string,
  ctx,
  bytes,
  pointer,
  TagOrWrapper,
  TagProducer,
  constant,
  endian,
  Endian,
  cString,
  sequence,
  byte,
  int8,
} from '../src';

const M2Array = <T>(tag: TagOrWrapper<T>): TagProducer<T> =>
  struct(
    uint32`size`,
    uint32`offset`,
    pointer(ctx`offset`, array(tag, ctx`size`))`elements`
  );

const M2String = struct(
  uint32`size`,
  uint32`offset`,
  pointer(ctx`offset`, cString())`value`
);

const fixed16 = int16;
const CImVector = struct(byte`b`, byte`g`, byte`r`, byte`a`);
const C2Vector = struct(float`x`, float`y`);
const C3Vector = struct(float`x`, float`y`, float`z`);
const C4Quaternion = struct(
  float`x`,
  float`y`,
  float`z`,
  float`w` // Unlike Quaternions elsewhere, the scalar part ('w') is the last element in the struct instead of the first
);
const CAaBox = struct(C3Vector`min`, C3Vector`max`);
const CRange = struct(float`min`, float`max`);
const M2Range = struct(uint32`minimum`, uint32`maximum`);
const M2Bounds = struct(CAaBox`extent`, float`radius`);
const M2Box = struct(
  C3Vector`ModelRotationSpeedMin`,
  C3Vector`ModelRotationSpeedMax`
);
const M2SplineKey = <T>(tag: TagProducer<T>): TagProducer<T> =>
  struct(tag`value`, tag`inTan`, tag`outTan`);

const M2TrackBase = struct(
  uint16`trackType`,
  uint16`loopIndex`,
  M2Array(M2Array(uint32))`sequenceTimes`
);

const M2Track = <T>(tag: TagOrWrapper<T>): TagProducer<T> =>
  struct(
    uint16`interpolation_type`,
    uint16`global_sequence`,
    M2Array(M2Array(uint32))`timestamps`,
    M2Array(M2Array(tag))`values`
  );

const M2Vertex = struct(
  C3Vector`pos`,
  bytes(4)`bone_weights`,
  bytes(4)`bone_indices`,
  C3Vector`normal`,
  sequence(C2Vector, C2Vector)`tex_coords` // two textures, depending on shader used
);

const M2Sequence = struct(
  uint16`id`,
  uint16`variationIndex`,
  uint32`duration`,
  float`movespeed`,
  uint32`flags`,
  int16`frequency`,
  uint16`padding`,
  M2Range`replay`,
  uint16`blendTimeIn`,
  uint16`blendTimeOut`,
  M2Bounds`bounds`,
  int16`variationNext`,
  uint16`aliasNext`
);

const M2CompBone = struct(
  int32`key_bone_id`,
  uint32`flags`,
  int16`parent_bone`,
  uint16`submesh_id`,
  uint32`boneNameCRC`,
  M2Track(C3Vector)`translation`,
  M2Track(C4Quaternion)`rotation`,
  M2Track(C3Vector)`scale`,
  C3Vector`pivot`
);

const M2Color = struct(M2Track(C3Vector)`color`, M2Track(fixed16)`alpha`);
const M2Texture = struct(uint32`type`, uint32`flags`, M2String`filename`);
const M2TextureWeight = struct(M2Track(fixed16)`weight`);
const M2TextureTransform = struct(
  M2Track(C3Vector)`translation`,
  M2Track(C4Quaternion)`rotation`,
  M2Track(C3Vector)`scaling`
);
const M2Material = struct(uint16`flags`, uint16`blending_mode`);

const M2Attachment = struct(
  uint32`id`,
  uint16`bone`,
  uint16`unknown`,
  C3Vector`position`,
  M2Track(byte)`animate_attached`
);

const M2Event = struct(
  string(4)`identifier`,
  uint32`data`,
  uint32`bone`,
  C3Vector`position`,
  M2TrackBase`enabled`
);

const M2Light = struct(
  uint16`type`,
  int16`bone`,
  C3Vector`position`,
  M2Track(C3Vector)`ambient_color`,
  M2Track(float)`ambient_intensity`,
  M2Track(C3Vector)`diffuse_color`,
  M2Track(float)`diffuse_intensity`,
  M2Track(float)`attenuation_start`,
  M2Track(float)`attenuation_end`,
  M2Track(uint8)`visibility`
);

const M2Camera = struct(
  uint32`type`,
  float`fov`,
  float`far_clip`,
  float`near_clip`,
  M2Track(M2SplineKey(C3Vector))`positions`,
  C3Vector`position_base`,
  M2Track(M2SplineKey(C3Vector))`target_position`,
  C3Vector`target_position_base`,
  M2Track(M2SplineKey(float))`roll`
);

const M2Ribbon = struct(
  uint32`ribbonId`,
  uint32`boneIndex`,
  C3Vector`position`,
  M2Array(uint16)`textureIndices`,
  M2Array(uint16)`materialIndices`,
  M2Track(C3Vector)`colorTrack`,
  M2Track(fixed16)`alphaTrack`,
  M2Track(float)`heightAboveTrack`,
  M2Track(float)`heightBelowTrack`,
  float`edgesPerSecond`,
  float`edgeLifetime`,
  float`gravity`,
  uint16`textureRows`,
  uint16`textureCols`,
  M2Track(uint16)`texSlotTrack`,
  M2Track(byte)`visibilityTrack`,
  int16`priorityPlane`,
  uint16`padding`
);

const M2Particle = struct(
  uint32`particleId`,
  uint32`flags`,
  C3Vector`position`,
  uint16`bone`,
  uint16`texture`,
  M2String`geometry_model_filename`,
  M2String`recursion_,model_filename`,
  uint8`blendingType`,
  uint8`emitterType`,
  uint16`particleColorIndex`,
  uint8`particleType`,
  uint8`headorTail`,
  uint16`textureTileRotation`,
  uint16`textureDimensions_rows`,
  uint16`textureDimensions_columns`,
  M2Track(float)`emissionSpeed`,
  M2Track(float)`speedVariation`,
  M2Track(float)`verticalRange`,
  M2Track(float)`horizontalRange`,
  M2Track(float)`gravity`,
  M2Track(float)`lifespan`,
  M2Track(float)`emissionRate`,
  M2Track(float)`emissionAreaLength`,
  M2Track(float)`emissionAreaWidth`,
  M2Track(float)`zSource`,
  float`midPoint`,
  array(CImVector, 3)`colorValues`,
  array(float, 3)`scaleValues`,
  array(uint16, 3)`lifespanUVAnim`,
  array(uint16, 3)`decayUVAnim`,
  array(int16, 2)`tailUVAnim`,
  array(int16, 2)`tailDecayUVAnim`,
  float`tailLength`,
  float`twinkleSpeed`,
  float`twinklePercent`,
  CRange`twinkleScale`,
  float`burstMultiplier`,
  float`drag`,
  float`spin`,
  M2Box`tumble`,
  C3Vector`windVector`,
  float`windTime`,
  float`followSpeed1`,
  float`followScale1`,
  float`followSpeed2`,
  float`followScale2`,
  M2Array(C3Vector)`splinePoints`,
  M2Track(byte)`enabledIn`
);

export const m2File = struct(
  //
  endian(Endian.LE),
  constant(string(4), 'MD20'),
  uint32`version`,
  M2String`name`,
  uint32`global_flags`,
  M2Array(uint16)`global_loops`,
  M2Array(M2Sequence)`sequences`,
  M2Array(uint16)`sequenceIdxHashById`,

  M2Array(M2CompBone)`bones`,
  M2Array(uint16)`boneIndicesById`,
  M2Array(M2Vertex)`vertices`,
  uint32`num_skin_profiles`,

  M2Array(M2Color)`colors`,
  M2Array(M2Texture)`textures`,
  M2Array(M2TextureWeight)`texture_weights`,
  M2Array(M2TextureTransform)`texture_transforms`,
  M2Array(uint16)`textureIndicesById`,
  M2Array(M2Material)`materials`,
  M2Array(uint16)`boneCombos`,
  M2Array(uint16)`textureCombos`,
  M2Array(uint16)`textureTransformBoneMap`,
  M2Array(uint16)`textureWeightCombos`,
  M2Array(uint16)`textureTransformCombos`,

  CAaBox`bounding_box`,
  float`bounding_sphere_radius`,
  CAaBox`collision_box`,
  float`collision_sphere_radius`,

  M2Array(uint16)`collisionIndices`,
  M2Array(C3Vector)`collisionPositions`,
  M2Array(C3Vector)`collisionFaceNormals`,
  M2Array(M2Attachment)`attachments`,
  M2Array(uint16)`attachmentIndicesById`,
  M2Array(M2Event)`events`,
  M2Array(M2Light)`lights`,
  M2Array(M2Camera)`cameras`,
  M2Array(uint16)`cameraIndicesById`,
  M2Array(M2Ribbon)`ribbon_emitters`,
  M2Array(M2Particle)`particle_emitters`
);

const M2Batch = struct(
  uint8`flags`,
  int8`priorityPlane`,
  uint16`shader_id`,
  uint16`skinSectionIndex`,
  uint16`geosetIndex`,
  uint16`colorIndex`,
  uint16`materialIndex`,
  uint16`materialLayer`,
  uint16`textureCount`,
  uint16`textureComboIndex`,
  uint16`textureCoordComboIndex`,
  uint16`textureWeightComboIndex`,
  uint16`textureTransformComboIndex`
);

const M2SkinSection = struct(
  uint16`skinSectionId`,
  uint16`level`,
  uint16`vertexStart`,
  uint16`vertexCount`,
  uint16`indexStart`,
  uint16`indexCount`,
  uint16`boneCount`,
  uint16`boneComboIndex`,
  uint16`boneInfluences`,
  uint16`centerBoneIndex`,
  C3Vector`centerPosition`,
  C3Vector`sortCenterPosition`,
  float`sortRadius`
);

export const skinFile = struct(
  endian(Endian.LE),
  constant(string(4), 'SKIN'),
  M2Array(uint16)`vertices`,
  M2Array(uint16)`indices`,
  M2Array(bytes(4))`bones`,
  M2Array(M2SkinSection)`submeshes`,
  M2Array(M2Batch)`batches`,
  uint32`boneCountMax`
);
