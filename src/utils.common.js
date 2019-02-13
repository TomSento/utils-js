/* eslint-disable import/first */
/* eslint import/newline-after-import: "off" */

import '../utils/0_internal/typ';

import '../utils/1_primitives/array/Array.prototype.find';
import '../utils/1_primitives/array/Array.prototype.findIndex';
import '../utils/1_primitives/array/Array.prototype.remove';
import '../utils/1_primitives/array/Array.prototype.unique';

export { default as clone } from '../utils/1_primitives/object/Cor.clone';
export { default as extend } from '../utils/1_primitives/object/Cor.extend';

import '../utils/1_primitives/string/String.prototype.escape';
import '../utils/1_primitives/string/String.prototype.padEnd';
import '../utils/1_primitives/string/String.prototype.padStart';
import '../utils/1_primitives/string/String.prototype.slug';
import '../utils/1_primitives/string/String.prototype.strip';

export { default as all } from '../utils/2_core/Cor.all';
export { default as extension } from '../utils/2_core/Cor.extension';
export { default as h } from '../utils/2_core/Cor.h';
export { default as Schema } from '../utils/2_core/Cor.Schema';
export { default as uid1 } from '../utils/2_core/Cor.uid1';
export { default as uid2 } from '../utils/2_core/Cor.uid2';
export { default as userAgent } from '../utils/2_core/Cor.userAgent';
import '../utils/2_core/log';
