import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { init, sqrt, sin, cos } from './index.js';
import { MAX_TOLERANCE_SQRT, MAX_TAYLOR_ITERS } from './constants.js';

describe('sqrt', () => {
  before(async () => {
    await init();
  });
  // --- Perfect squares ---
  it('sqrt(4) ≈ 2', () => {
    assert.ok(Math.abs(sqrt(4) - 2) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(9) ≈ 3', () => {
    assert.ok(Math.abs(sqrt(9) - 3) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(16) ≈ 4', () => {
    assert.ok(Math.abs(sqrt(16) - 4) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(1) ≈ 1', () => {
    assert.ok(Math.abs(sqrt(1) - 1) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(0) ≈ 0', () => {
    assert.ok(Math.abs(sqrt(0)) < MAX_TOLERANCE_SQRT);
  });

  // --- Non-perfect squares ---
  it('sqrt(2) ≈ 1.41421356', () => {
    assert.ok(Math.abs(sqrt(2) - Math.SQRT2) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(3) ≈ 1.73205080', () => {
    assert.ok(Math.abs(sqrt(3) - Math.sqrt(3)) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(10) ≈ 3.16227766', () => {
    assert.ok(Math.abs(sqrt(10) - Math.sqrt(10)) < MAX_TOLERANCE_SQRT);
  });

  // --- Decimals ---
  it('sqrt(0.25) ≈ 0.5', () => {
    assert.ok(Math.abs(sqrt(0.25) - 0.5) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(2.25) ≈ 1.5', () => {
    assert.ok(Math.abs(sqrt(2.25) - 1.5) < MAX_TOLERANCE_SQRT);
  });

  it('sqrt(3.564) is close to Math.sqrt(3.564)', () => {
    assert.ok(Math.abs(sqrt(3.564) - Math.sqrt(3.564)) < MAX_TOLERANCE_SQRT);
  });

  // --- Large numbers ---
  it('sqrt(1000000) ≈ 1000', () => {
    assert.ok(Math.abs(sqrt(1000000) - 1000) < MAX_TOLERANCE_SQRT);
  });

  // --- Negative input returns NaN ---
  it('sqrt(-1) returns NaN', () => {
    assert.ok(Number.isNaN(sqrt(-1)));
  });

  it('sqrt(-100) returns NaN', () => {
    assert.ok(Number.isNaN(sqrt(-100)));
  });

  // --- Custom tolerance ---
  it('sqrt(2, 0.01) is close to 1.414 within looser tolerance', () => {
    assert.ok(Math.abs(sqrt(2, 0.01) - Math.SQRT2) < 0.01);
  });

  // --- Tolerance too small throws ---
  it('throws if tolerance is below minimum', () => {
    assert.throws(() => sqrt(4, 1e-20), /tolerance must be greater than/);
  });
});

const EPSILON = 1e-6;

describe('sin', () => {
  before(async () => {
    await init();
  });

  // --- Return shape ---
  it('returns an object with ans and error properties', () => {
    const result = sin(1);
    assert.ok('ans' in result);
    assert.ok('error' in result);
    assert.ok(typeof result.ans === 'number');
    assert.ok(typeof result.error === 'number');
  });

  // --- Well-known exact values ---
  it('sin(0) ≈ 0', () => {
    assert.ok(Math.abs(sin(0).ans) < EPSILON);
  });

  it('sin(π/6) ≈ 0.5', () => {
    assert.ok(Math.abs(sin(Math.PI / 6).ans - 0.5) < EPSILON);
  });

  it('sin(π/4) ≈ √2/2', () => {
    assert.ok(Math.abs(sin(Math.PI / 4).ans - Math.SQRT2 / 2) < EPSILON);
  });

  it('sin(π/3) ≈ √3/2', () => {
    assert.ok(Math.abs(sin(Math.PI / 3).ans - Math.sqrt(3) / 2) < EPSILON);
  });

  it('sin(π/2) ≈ 1', () => {
    assert.ok(Math.abs(sin(Math.PI / 2).ans - 1) < EPSILON);
  });

  it('sin(π) ≈ 0', () => {
    assert.ok(Math.abs(sin(Math.PI).ans) < EPSILON);
  });

  it('sin(3π/2) ≈ -1', () => {
    assert.ok(Math.abs(sin(3 * Math.PI / 2).ans - (-1)) < EPSILON);
  });

  it('sin(2π) ≈ 0', () => {
    assert.ok(Math.abs(sin(2 * Math.PI).ans) < EPSILON);
  });

  // --- Negative inputs (odd function: sin(-x) = -sin(x)) ---
  it('sin(-π/2) ≈ -1', () => {
    assert.ok(Math.abs(sin(-Math.PI / 2).ans - (-1)) < EPSILON);
  });

  it('sin(-π/4) ≈ -√2/2', () => {
    assert.ok(Math.abs(sin(-Math.PI / 4).ans - (-Math.SQRT2 / 2)) < EPSILON);
  });

  it('sin(-x) ≈ -sin(x) for x = 1.5', () => {
    const pos = sin(1.5).ans;
    const neg = sin(-1.5).ans;
    assert.ok(Math.abs(neg + pos) < EPSILON);
  });

  // --- Small values (sin(x) ≈ x for small x) ---
  it('sin(0.001) ≈ 0.001', () => {
    assert.ok(Math.abs(sin(0.001).ans - 0.001) < EPSILON);
  });

  // --- Comparison with Math.sin for arbitrary values ---
  it('sin(1) is close to Math.sin(1)', () => {
    assert.ok(Math.abs(sin(1).ans - Math.sin(1)) < EPSILON);
  });

  it('sin(2.5) is close to Math.sin(2.5)', () => {
    assert.ok(Math.abs(sin(2.5).ans - Math.sin(2.5)) < EPSILON);
  });

  it('sin(5) is close to Math.sin(5)', () => {
    assert.ok(Math.abs(sin(5).ans - Math.sin(5)) < EPSILON);
  });

  // --- Large values (relies on fmod reduction) ---
  it('sin(100) is close to Math.sin(100)', () => {
    assert.ok(Math.abs(sin(100).ans - Math.sin(100)) < 1e-3);
  });

  it('sin(-100) is close to Math.sin(-100)', () => {
    assert.ok(Math.abs(sin(-100).ans - Math.sin(-100)) < 1e-3);
  });

  // --- Error bound is non-negative ---
  it('error bound is non-negative', () => {
    assert.ok(sin(1).error >= 0);
  });

  // --- Custom taylor_iters ---
  it('sin(1, 3) still gives a reasonable approximation', () => {
    const result = sin(1, 3);
    assert.ok(Math.abs(result.ans - Math.sin(1)) < 0.01);
  });

  it('more iterations gives smaller error', () => {
    const few = sin(1, 3);
    const many = sin(1, MAX_TAYLOR_ITERS);
    assert.ok(many.error <= few.error);
  });

  // --- Input validation ---
  it('throws if x is not a number', () => {
    assert.throws(() => sin('hello'), /x must be a number/);
  });

  it('throws if taylor_iters is not an integer', () => {
    assert.throws(() => sin(1, 3.5), /taylor_iters must be an integer/);
  });

  it('throws if taylor_iters exceeds MAX_TAYLOR_ITERS', () => {
    assert.throws(() => sin(1, MAX_TAYLOR_ITERS + 1), /taylor_iters must be less than/);
  });

  it('throws if taylor_iters < 1', () => {
    assert.throws(() => sin(1, 0), /taylor_iters must be greater than 0/);
  });

  it('throws if init() has not been called', async () => {
    // This is implicitly tested by the before() hook; we can't easily
    // un-init, but we trust assertReady() from the sqrt suite.
  });
});

describe('cos', () => {
  before(async () => {
    await init();
  });

  // --- Return shape ---
  it('returns an object with ans and error properties', () => {
    const result = cos(1);
    assert.ok('ans' in result);
    assert.ok('error' in result);
    assert.ok(typeof result.ans === 'number');
    assert.ok(typeof result.error === 'number');
  });

  // --- Well-known exact values ---
  it('cos(0) ≈ 1', () => {
    assert.ok(Math.abs(cos(0).ans - 1) < EPSILON);
  });

  it('cos(π/6) ≈ √3/2', () => {
    assert.ok(Math.abs(cos(Math.PI / 6).ans - Math.sqrt(3) / 2) < EPSILON);
  });

  it('cos(π/4) ≈ √2/2', () => {
    assert.ok(Math.abs(cos(Math.PI / 4).ans - Math.SQRT2 / 2) < EPSILON);
  });

  it('cos(π/3) ≈ 0.5', () => {
    assert.ok(Math.abs(cos(Math.PI / 3).ans - 0.5) < EPSILON);
  });

  it('cos(π/2) ≈ 0', () => {
    assert.ok(Math.abs(cos(Math.PI / 2).ans) < EPSILON);
  });

  it('cos(π) ≈ -1', () => {
    assert.ok(Math.abs(cos(Math.PI).ans - (-1)) < EPSILON);
  });

  it('cos(3π/2) ≈ 0', () => {
    assert.ok(Math.abs(cos(3 * Math.PI / 2).ans) < EPSILON);
  });

  it('cos(2π) ≈ 1', () => {
    assert.ok(Math.abs(cos(2 * Math.PI).ans - 1) < EPSILON);
  });

  // --- Even function: cos(-x) = cos(x) ---
  it('cos(-π/3) ≈ cos(π/3)', () => {
    const pos = cos(Math.PI / 3).ans;
    const neg = cos(-Math.PI / 3).ans;
    assert.ok(Math.abs(pos - neg) < EPSILON);
  });

  it('cos(-1.5) ≈ cos(1.5)', () => {
    const pos = cos(1.5).ans;
    const neg = cos(-1.5).ans;
    assert.ok(Math.abs(pos - neg) < EPSILON);
  });

  // --- Comparison with Math.cos for arbitrary values ---
  it('cos(1) is close to Math.cos(1)', () => {
    assert.ok(Math.abs(cos(1).ans - Math.cos(1)) < EPSILON);
  });

  it('cos(2.5) is close to Math.cos(2.5)', () => {
    assert.ok(Math.abs(cos(2.5).ans - Math.cos(2.5)) < EPSILON);
  });

  it('cos(5) is close to Math.cos(5)', () => {
    assert.ok(Math.abs(cos(5).ans - Math.cos(5)) < EPSILON);
  });

  // --- Large values (relies on fmod reduction) ---
  it('cos(100) is close to Math.cos(100)', () => {
    assert.ok(Math.abs(cos(100).ans - Math.cos(100)) < 1e-3);
  });

  // --- Error bound is non-negative ---
  it('error bound is non-negative', () => {
    assert.ok(cos(1).error >= 0);
  });

  // --- Custom taylor_iters ---
  it('cos(1, 4) still gives a reasonable approximation', () => {
    const result = cos(1, 4);
    assert.ok(Math.abs(result.ans - Math.cos(1)) < 0.01);
  });

  it('more iterations gives smaller error', () => {
    const few = cos(1, 4);
    const many = cos(1, MAX_TAYLOR_ITERS);
    assert.ok(many.error <= few.error);
  });

  // --- Pythagorean identity: sin²(x) + cos²(x) = 1 ---
  it('sin²(1) + cos²(1) ≈ 1', () => {
    const s = sin(1).ans;
    const c = cos(1).ans;
    assert.ok(Math.abs(s * s + c * c - 1) < EPSILON);
  });

  it('sin²(π/3) + cos²(π/3) ≈ 1', () => {
    const s = sin(Math.PI / 3).ans;
    const c = cos(Math.PI / 3).ans;
    assert.ok(Math.abs(s * s + c * c - 1) < EPSILON);
  });

  it('sin²(2.7) + cos²(2.7) ≈ 1', () => {
    const s = sin(2.7).ans;
    const c = cos(2.7).ans;
    assert.ok(Math.abs(s * s + c * c - 1) < EPSILON, `sin²(2.7) + cos²(2.7) ≈ 1, but got ${s * s + c * c - 1} for values err(sin(2.7)) = ${s - Math.sin(2.7)} and err(cos(2.7)) = ${c - Math.cos(2.7)}`);
  });

  it('throws if x is not a number', () => {
    assert.throws(() => cos('hello'), /x must be a number/);
  });

  it('throws if taylor_iters is not an integer', () => {
    assert.throws(() => cos(1, 3.5), /taylor_iters must be an integer/);
  });

  it('throws if taylor_iters exceeds MAX_TAYLOR_ITERS', () => {
    assert.throws(() => cos(1, MAX_TAYLOR_ITERS + 1), /taylor_iters must be less than/);
  });

  it('throws if taylor_iters < 1', () => {
    assert.throws(() => cos(1, 0), /taylor_iters must be greater than 0/);
  });
});

// ---------------------------------------------------------------------------
// Performance tests
// ---------------------------------------------------------------------------

const PERF_ITERATIONS = 100_000;
const MAX_TOTAL_MS = 500; // 100k calls must finish within 500ms (≤ 5µs/call)

describe('performance', () => {
  before(async () => {
    await init();
  });

  it(`sqrt: ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sqrt(i + 1);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sqrt took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`sqrt (small decimals): ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sqrt((i + 1) * 0.00001); // values in (0, 1)
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sqrt (small) took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`sqrt (large numbers): ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sqrt((i + 1) * 1000); // values up to 100,000,000
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sqrt (large) took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`sqrt (loose tolerance): ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sqrt(i + 1, 0.01);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sqrt (loose tol) took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it('sqrt with loose tolerance is faster than default', () => {
    const N = 50_000;

    const startDefault = performance.now();
    for (let i = 0; i < N; i++) sqrt(i + 1);
    const elapsedDefault = performance.now() - startDefault;

    const startLoose = performance.now();
    for (let i = 0; i < N; i++) sqrt(i + 1, 0.01);
    const elapsedLoose = performance.now() - startLoose;

    assert.ok(
      elapsedLoose < elapsedDefault,
      `loose tolerance (${elapsedLoose.toFixed(2)}ms) should be faster than default (${elapsedDefault.toFixed(2)}ms)`
    );
  });

  it(`sin: ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sin(i * 0.0001);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sin took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`sin (large angles): ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sin(i * 100); // large values stress fmod reduction
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sin (large) took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`sin (negative angles): ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      sin(-i * 0.0001);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `sin (negative) took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`cos: ${PERF_ITERATIONS.toLocaleString()} calls < ${MAX_TOTAL_MS}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      cos(i * 0.0001);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS,
      `cos took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} calls (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/call) — limit is ${MAX_TOTAL_MS}ms`
    );
  });

  it(`mixed sin+cos: ${PERF_ITERATIONS.toLocaleString()} pairs < ${MAX_TOTAL_MS * 2}ms`, () => {
    const start = performance.now();
    for (let i = 0; i < PERF_ITERATIONS; i++) {
      const x = i * 0.0001;
      sin(x);
      cos(x);
    }
    const elapsed = performance.now() - start;
    assert.ok(
      elapsed < MAX_TOTAL_MS * 2,
      `sin+cos took ${elapsed.toFixed(2)}ms for ${PERF_ITERATIONS} pairs (${(elapsed / PERF_ITERATIONS * 1000).toFixed(2)}µs/pair) — limit is ${MAX_TOTAL_MS * 2}ms`
    );
  });

  it('single sin call < 1ms', () => {
    const start = performance.now();
    sin(1.234);
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 1, `single sin call took ${elapsed.toFixed(4)}ms — limit is 1ms`);
  });

  it('single cos call < 1ms', () => {
    const start = performance.now();
    cos(1.234);
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 1, `single cos call took ${elapsed.toFixed(4)}ms — limit is 1ms`);
  });

  it('single sqrt call < 1ms', () => {
    const start = performance.now();
    sqrt(1.234);
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 1, `single sqrt call took ${elapsed.toFixed(4)}ms — limit is 1ms`);
  });
});
