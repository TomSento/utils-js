import '../utils/0_internal/malloc';
import '../utils/0_internal/typ';

import '../utils/1_primitives/array/Array.prototype.find';
import '../utils/1_primitives/array/Array.prototype.findIndex';
import '../utils/1_primitives/array/Array.prototype.remove';
import '../utils/1_primitives/array/Array.prototype.unique';

export { default as clone } from '../utils/1_primitives/object/clone';
export { default as extend } from '../utils/1_primitives/object/extend';

export { default as extension } from '../utils/1_primitives/string/extension';
import '../utils/1_primitives/string/String.prototype.escape';
import '../utils/1_primitives/string/String.prototype.fmt';
import '../utils/1_primitives/string/String.prototype.padEnd';
import '../utils/1_primitives/string/String.prototype.padStart';
import '../utils/1_primitives/string/String.prototype.slug';
import '../utils/1_primitives/string/String.prototype.strip';

export { default as all } from '../utils/2_core/all';
export { default as h } from '../utils/2_core/h';
import '../utils/2_core/log';
import '../utils/2_core/Schema';
import '../utils/2_core/test';
import '../utils/2_core/uid1';
import '../utils/2_core/uid2';
import '../utils/2_core/userAgent';
