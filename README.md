# izi-math

Cross-platform deterministic custom implementation of certain math operations:
- `sqrt` — bisection method
- `sin` — Taylor series with error bound
- `cos` — Taylor series with error bound

## Motivation

For some projects I need cross-platform determinism more than I need accuracy for these operations.
Also felt like applying some basic knowledge I learned in university.

## Prerequisites

Install [Emscripten](https://emscripten.org/docs/getting_started/downloads.html):

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Usage

```js
import { init, sqrt, sin, cos } from 'izi-math';

await init(); // load the wasm module (call once)

// Square root
sqrt(16);           // 4
sqrt(2);            // 1.41421356...
sqrt(2, 0.01);      // 1.41... (looser tolerance, faster)

// Sine (radians)
sin(Math.PI / 2);   // { ans: 1, error: 2.55e-254 }
sin(1, 5);          // { ans: 0.8416..., error: 0.00001... } (fewer iterations)

// Cosine (radians)
cos(0);             // { ans: 1, error: 0 }
cos(Math.PI);       // { ans: -1, error: 2.55e-254 }
```

## Available functions

| Function | Signature | Description |
|---|---|---|
| `sqrt` | `(a, tolerance?) → number` | Square root via bisection (returns NaN if a < 0) |
| `sin` | `(x, taylor_iters?) → { ans, error }` | Sine via Taylor series (x in radians) |
| `cos` | `(x, taylor_iters?) → { ans, error }` | Cosine via Taylor series (x in radians) |

### Defaults

| Parameter | Default | Notes |
|---|---|---|
| `tolerance` | `1e-8` | Minimum allowed value is `1e-8` |
| `taylor_iters` | `170` | Must be an integer in the range `[1, 170]` |

## Adding new C functions

1. Add your function to `src/math.c` using `double` params and return type, marked with `EMSCRIPTEN_KEEPALIVE`
2. Add `"_your_function_name"` to the `EXPORTED_FUNCTIONS` list in `build.sh`
3. Add a `cwrap` call in `index.js` and export a wrapper
4. Add the TypeScript signature to `index.d.ts`
5. Run `npm run build`