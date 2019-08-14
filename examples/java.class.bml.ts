import {
  struct,
  uint16,
  byte,
  uint32,
  constant,
  array,
  sizedArray,
  bitMask,
  enums,
  branch,
  ctx,
  pascalString,
  Encoding,
  computed,
  lazyBound,
  pass,
  TagProducer,
  peek,
  bytes,
} from '../src';

const u1 = byte;
const u2 = uint16;
const u4 = uint32;
let annotation: TagProducer<unknown>; // for lazy initialization

const constantClassInfo = struct(u2`name_index`);
const constantRefInfo = struct(u2`class_index`, u2`name_and_type_index`);
const constantStringInfo = struct(u2`string_index`);
const constantNumberInfo = struct(u4`bytes`);
const constantLongInfo = struct(u4`high_bytes`, u4`low_bytes`);
const constantNameAndTypeInfo = struct(u2`name_index`, u2`descriptor_index`);
const constantUtf8Info = struct(pascalString(u2, Encoding.utf8)`string`);
const constantMethodHandleInfo = struct(
  u1`reference_kind`,
  u2`reference_index`
);
const constantMethodTypeInfo = struct(u2`descriptor_index`);
const constantDynamicInfo = struct(
  u2`bootstrap_method_attr_index`,
  u2`name_and_type_index`
);

const constantPoolInfo = struct(
  enums(u1, {
    constantClass: 7,
    constantFieldref: 9,
    constantMethodref: 10,
    constantInterfaceMethodref: 11,
    constantString: 8,
    constantInteger: 3,
    constantFloat: 4,
    constantLong: 5,
    constantDouble: 6,
    constantNameAndType: 12,
    constantUtf8: 1,
    constantMethodHandle: 15,
    constantMethodType: 16,
    constantDynamic: 17,
    constantInvokeDynamic: 18,
    constantModule: 19,
    constantPackage: 20,
  })`tag`,
  branch(ctx`tag`, {
    constantClass: constantClassInfo,
    constantFieldref: constantRefInfo,
    constantMethodref: constantRefInfo,
    constantInterfaceMethodref: constantRefInfo,
    constantString: constantStringInfo,
    constantInteger: constantNumberInfo,
    constantFloat: constantNumberInfo,
    constantLong: constantLongInfo,
    constantDouble: constantLongInfo,
    constantNameAndType: constantNameAndTypeInfo,
    constantUtf8: constantUtf8Info,
    constantMethodHandle: constantMethodHandleInfo,
    constantMethodType: constantMethodTypeInfo,
    constantDynamic: constantDynamicInfo,
    constantInvokeDynamic: constantDynamicInfo,
    constantModule: constantClassInfo,
    constantPackage: constantClassInfo,
  })`info`
);

const verificationTypeInfo = struct(
  enums(u1, {
    itemTop: 0,
    itemInteger: 1,
    itemFloat: 2,
    itemDouble: 3,
    itemLong: 4,
    itemNull: 5,
    itemUninitializedThis: 6,
    itemObject: 7,
    itemUninitialized: 8,
  })`tag`,
  branch(ctx`tag`, {
    itemObject: struct(u2`cpool_index`),
    itemUninitialized: struct(u2`offset`),
  })`info`
);

const stackMapFrame = struct(
  u1`frame_type`,
  computed(ctx => {
    const index = ctx.get<number>('frame_type');
    if (index < 64) return 'SAME';
    if (index < 128) return 'SAME_LOCALS_1_STACK_ITEM';
    if (index === 247) return 'SAME_LOCALS_1_STACK_ITEM_EXTENDED';
    if (index >= 248 && index <= 250) return 'CHOP';
    if (index === 251) return 'SAME_FRAME_EXTENDED';
    if (index >= 252 && index <= 254) return 'APPEND';
    if (index === 255) return 'FULL';
  })`type`,
  branch(ctx`type`, {
    SAME: pass,
    SAME_LOCALS_1_STACK_ITEM: struct(array(verificationTypeInfo, 1)`stack`),
    SAME_LOCALS_1_STACK_ITEM_EXTENDED: struct(
      u2`offset_delta`,
      array(verificationTypeInfo, 1)`stack`
    ),
    CHOP: struct(u2`offset_delta`),
    SAME_FRAME_EXTENDED: struct(u2`offset_delta`),
    APPEND: struct(
      u2`offset_delta`,
      array(
        verificationTypeInfo,
        ctx => ctx.get<number>('frame_type') - 251
      )`locals`
    ),
    FULL: struct(
      sizedArray(verificationTypeInfo, u2)`locals`,
      sizedArray(verificationTypeInfo, u2)`stack`
    ),
  })`info`
);

const elementValue: TagProducer<unknown> = struct(
  u1`tag`,
  branch(ctx => String.fromCharCode(ctx.get<number>('tag')), {
    B: u2,
    C: u2,
    D: u2,
    F: u2,
    I: u2,
    J: u2,
    S: u2,
    Z: u2,
    s: u2,
    e: struct(u2`type_name_index`, u2`const_name_index`),
    c: u2,
    '@': lazyBound(() => annotation),
    '[': sizedArray(lazyBound(() => elementValue), u2),
  })`value`
);

annotation = struct(
  u2`type_index`,
  sizedArray(
    struct(u2`element_name_index`, elementValue`value`),
    u2
  )`element_value_pairs`
);

const typeParameterTarget = struct(u1`type_parameter_index`);
const supertypeTarget = struct(u1`supertype_index`);
const typeParameterBoundTarget = struct(
  u1`type_parameter_index`,
  u1`bound_index`
);
const formalParameterTarget = struct(u1`formal_parameter_index`);
const throwsTarget = struct(u2`throws_type_index`);
const localvarTarget = struct(
  sizedArray(struct(u2`start_pc`, u2`length`, u2`index`), u2)`table`
);
const catchTarget = struct(u2`exception_table_index`);
const offsetTarget = struct(u2`offset`);
const typeArgumentTarget = struct(u2`offset`, u1`type_argument_index`);
const typePath = struct(
  sizedArray(struct(u1`type_path_kind`, u1`type_argument_index`), u1)`path`
);

const typeAnnotation = struct(
  u1`target_type`,
  branch(ctx`target_type`, {
    0x00: typeParameterTarget,
    0x01: typeParameterTarget,
    0x10: supertypeTarget,
    0x11: typeParameterBoundTarget,
    0x12: typeParameterBoundTarget,
    0x13: pass,
    0x14: pass,
    0x15: pass,
    0x16: formalParameterTarget,
    0x17: throwsTarget,
    0x40: localvarTarget,
    0x41: localvarTarget,
    0x42: catchTarget,
    0x43: offsetTarget,
    0x44: offsetTarget,
    0x45: offsetTarget,
    0x46: offsetTarget,
    0x47: typeArgumentTarget,
    0x48: typeArgumentTarget,
    0x49: typeArgumentTarget,
    0x4a: typeArgumentTarget,
    0x4b: typeArgumentTarget,
  })`target_info`,
  typePath`target_path`,
  u2`type_index`,
  sizedArray(
    struct(u2`element_name_index`, elementValue`value`),
    u2
  )`element_value_pairs`
);

const attributeInfo: TagProducer<unknown> = struct(
  u2`attribute_name_index`,
  computed(ctx => {
    const index = ctx.get<number>('attribute_name_index');
    const pool = ctx.get<{ info: { string: string } }[]>('constantpool');
    const name = pool[index - 1].info.string; // constant pool is indexed starting with 1
    return name;
  })`name`,
  u4`attribute_length`,
  branch(
    ctx`name`,
    {
      ConstantValue: struct(u2`constantvalue_index`),
      Code: struct(
        u2`max_stack`,
        u2`max_locals`,
        sizedArray(u1, u4)`code`,
        sizedArray(
          struct(u2`start_pc`, u2`end_pc`, u2`handler_pc`, u2`catch_type`),
          u2
        )`exception_table`,
        sizedArray(lazyBound(() => attributeInfo), u2)`attributes`
      ),
      StackMapTable: struct(sizedArray(stackMapFrame, u2)`entries`),
      Exceptions: struct(sizedArray(u2, u2)`exception_index_table`),
      InnerClasses: struct(
        sizedArray(
          struct(
            u2`inner_class_info_index`,
            u2`outer_class_info_index`,
            u2`inner_name_index`,
            bitMask(u2, {
              ACC_PUBLIC: 0x0001,
              ACC_PRIVATE: 0x0002,
              ACC_PROTECTED: 0x0004,
              ACC_STATIC: 0x0008,
              ACC_FINAL: 0x0010,
              ACC_INTERFACE: 0x0200,
              ACC_ABSTRACT: 0x0400,
              ACC_SYNTHETIC: 0x1000,
              ACC_ANNOTATION: 0x2000,
              ACC_ENUM: 0x4000,
            })`inner_class_access_flags`
          ),
          u2
        )`classes`
      ),
      EnclosingMethod: struct(u2`class_index`, u2`method_index`),
      Synthetic: pass,
      Signature: struct(u2`signature_index`),
      SourceFile: struct(u2`sourcefile_index`),
      SourceDebugExtension: struct(
        array(u1, ctx`attribute_length`)`debug_extension`
      ),
      LineNumberTable: struct(
        peek(u2)`count`,
        sizedArray(struct(u2`start_pc`, u2`line_number`), u2)`line_number_table`
      ),
      LocalVariableTable: struct(
        sizedArray(
          struct(
            u2`start_pc`,
            u2`length`,
            u2`name_index`,
            u2`descriptor_index`,
            u2`index`
          ),
          u2
        )`local_variable_table`
      ),
      LocalVariableTypeTable: struct(
        sizedArray(
          struct(
            u2`start_pc`,
            u2`length`,
            u2`name_index`,
            u2`signature_index`,
            u2`index`
          ),
          u2
        )`local_variable_type_table`
      ),
      Deprecated: pass,
      RuntimeVisibleAnnotations: struct(
        sizedArray(annotation, u2)`annotations`
      ),
      RuntimeInvisibleAnnotations: struct(
        sizedArray(annotation, u2)`annotations`
      ),
      RuntimeVisibleParameterAnnotations: struct(
        sizedArray(sizedArray(annotation, u2), u1)`parameter_annotations`
      ),
      RuntimeInvisibleParameterAnnotations: struct(
        sizedArray(sizedArray(annotation, u2), u1)`parameter_annotations`
      ),
      RuntimeVisibleTypeAnnotations: struct(
        sizedArray(typeAnnotation, u2)`annotations`
      ),
      RuntimeInvisibleTypeAnnotations: struct(
        sizedArray(typeAnnotation, u2)`annotations`
      ),
      AnnotationDefault: struct(elementValue`default_value`),
      BootstrapMethods: struct(
        sizedArray(
          struct(
            u2`bootstrap_method_ref`,
            sizedArray(u2, u2)`bootstrap_arguments`
          ),
          u2
        )`bootstrap_methods`
      ),
      MethodParameters: struct(
        sizedArray(
          struct(
            u2`name_index`,
            bitMask(u2, {
              ACC_FINAL: 0x0010,
              ACC_SYNTHETIC: 0x1000,
              ACC_MANDATED: 0x8000,
            })`access_flags`
          ),
          u1
        )`parameters`
      ),
      Module: struct(
        u2`module_name_index`,
        bitMask(u2, {
          ACC_OPEN: 0x0020,
          ACC_SYNTHETIC: 0x1000,
          ACC_MANDATED: 0x8000,
        })`module_flags`,
        u2`module_version_index`,
        sizedArray(
          struct(
            u2`requires_index`,
            bitMask(u2, {
              ACC_TRANSITIVE: 0x0020,
              ACC_STATIC_PHASE: 0x0040,
              ACC_SYNTHETIC: 0x1000,
              ACC_MANDATED: 0x8000,
            })`requires_flags`,
            u2`requires_version_index`
          ),
          u2
        )`requires`,
        sizedArray(
          struct(
            u2`exports_index`,
            bitMask(u2, {
              ACC_SYNTHETIC: 0x1000,
              ACC_MANDATED: 0x8000,
            })`exports_flags`,
            sizedArray(u2, u2)`exports_to_index`
          ),
          u2
        )`exports`,
        sizedArray(
          struct(
            u2`opens_index`,
            bitMask(u2, {
              ACC_SYNTHETIC: 0x1000,
              ACC_MANDATED: 0x8000,
            })`opens_flags`,
            u2`opens_to_count`,
            sizedArray(u2, u2)`opens_to_index`
          ),
          u2
        )`opens`,
        sizedArray(u2, u2)`uses_index`,
        sizedArray(
          struct(u2`provides_index`, sizedArray(u2, u2)`provides_with_index`),
          u2
        )`provides`
      ),
      ModulePackages: struct(sizedArray(u2, u2)`package_index`),
      ModuleMainClass: struct(u2`main_class_index`),
      NestHost: struct(u2`host_class_index`),
      NestMembers: struct(sizedArray(u2, u2)`classes`),
    },
    bytes(ctx`attribute_length`)
  )`info`
);

const fieldInfo = struct(
  bitMask(u2, {
    ACC_PUBLIC: 0x0001,
    ACC_PRIVATE: 0x0002,
    ACC_PROTECTED: 0x0004,
    ACC_STATIC: 0x0008,
    ACC_FINAL: 0x0010,
    ACC_VOLATILE: 0x0040,
    ACC_TRANSIENT: 0x0080,
    ACC_SYNTHETIC: 0x1000,
    ACC_ENUM: 0x4000,
  })`access_flags`,
  u2`name_index`,
  u2`descriptor_index`,
  sizedArray(attributeInfo, u2)`attributes`
);

const methodInfo = struct(
  bitMask(u2, {
    ACC_PUBLIC: 0x0001,
    ACC_PRIVATE: 0x0002,
    ACC_PROTECTED: 0x0004,
    ACC_STATIC: 0x0008,
    ACC_FINAL: 0x0010,
    ACC_SYNCHRONIZED: 0x0020,
    ACC_BRIDGE: 0x0040,
    ACC_VARARGS: 0x0080,
    ACC_NATIVE: 0x0100,
    ACC_ABSTRACT: 0x0400,
    ACC_STRICT: 0x0800,
    ACC_SYNTHETIC: 0x1000,
  })`access_flags`,
  u2`name_index`,
  u2`descriptor_index`,
  sizedArray(attributeInfo, u2)`attributes`
);

export const classFile = struct(
  constant(u4, 0xcafebabe)`magic`,
  u2`minor_version`,
  u2`major_version`,
  u2`constantpool_count`,
  array(
    constantPoolInfo,
    ctx => ctx.get<number>('constantpool_count') - 1
  )`constantpool`,
  bitMask(u2, {
    ACC_PUBLIC: 0x0001,
    ACC_FINAL: 0x0010,
    ACC_SUPER: 0x0020,
    ACC_INTERFACE: 0x0200,
    ACC_ABSTRACT: 0x0400,
    ACC_SYNTHETIC: 0x1000,
    ACC_ANNOTATION: 0x2000,
    ACC_ENUM: 0x4000,
    ACC_MODULE: 0x8000,
  })`access_flags`,
  u2`this_class`,
  u2`super_class`,
  sizedArray(u2, u2)`interfaces`,
  sizedArray(fieldInfo, u2)`fields`,
  sizedArray(methodInfo, u2)`methods`,
  sizedArray(attributeInfo, u2)`attributes`
);
