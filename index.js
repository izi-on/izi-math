import createModule from './dist/math.mjs';
import { MAX_TAYLOR_ITERS, MAX_TOLERANCE_SQRT } from './constants.js';

let mod = null;

let _sqrt;
let _sin;
let _cos;

export async function init() {
  if (mod) return;
  mod = await createModule();

  _sqrt = mod.cwrap('izi_sqrt', 'number', ['number', 'number']);
  _sin = mod.cwrap('izi_sin', null, ['number', 'number', 'number']);
  _cos = mod.cwrap('izi_cos', null, ['number', 'number', 'number']);
}

function assertReady() {
  if (!mod) throw new Error('izi-math: call init() before using math functions');
}

export function sqrt(a, tolerance=MAX_TOLERANCE_SQRT) {
  assertReady();

  if (!Number.isFinite(a)) throw new Error('izi-math: a must be a number');
  if (!Number.isFinite(tolerance)) throw new Error('izi-math: tolerance must be a number');
  if (a < 0) return NaN;
  if (tolerance < MAX_TOLERANCE_SQRT) throw new Error(`izi-math: tolerance must be greater than ${MAX_TOLERANCE_SQRT}`);

  const ans = _sqrt(a, tolerance);
  if (ans == -1) throw new Error("izi-math: failed to calculate square root, unknown error");

  return ans;
}

export function sin(x, taylor_iters=MAX_TAYLOR_ITERS) {
  assertReady();

  if (!Number.isFinite(x)) throw new Error('izi-math: x must be a number');
  if (!Number.isInteger(taylor_iters)) throw new Error('izi-math: taylor_iters must be an integer');
  if (taylor_iters > MAX_TAYLOR_ITERS) throw new Error(`izi-math: taylor_iters must be less than ${MAX_TAYLOR_ITERS}`);
  if (taylor_iters < 1) throw new Error('izi-math: taylor_iters must be greater than 0');

  const ptr = mod._malloc(16); // 2 doubles = 16 bytes
  try {
    _sin(x, taylor_iters, ptr);
    return { ans: mod.HEAPF64[ptr / 8], error: mod.HEAPF64[ptr / 8 + 1] };
  } finally {
    mod._free(ptr);
  }
}

export function cos(x, taylor_iters=MAX_TAYLOR_ITERS) {
  assertReady();

  if (!Number.isFinite(x)) throw new Error('izi-math: x must be a number');
  if (!Number.isInteger(taylor_iters)) throw new Error('izi-math: taylor_iters must be an integer');
  if (taylor_iters > MAX_TAYLOR_ITERS) throw new Error(`izi-math: taylor_iters must be less than ${MAX_TAYLOR_ITERS}`);
  if (taylor_iters < 1) throw new Error('izi-math: taylor_iters must be greater than 0');

  const ptr = mod._malloc(16); // 2 doubles = 16 bytes
  try {
    _cos(x, taylor_iters, ptr);
    return { ans: mod.HEAPF64[ptr / 8], error: mod.HEAPF64[ptr / 8 + 1] };
  } finally {
    mod._free(ptr);
  }
}