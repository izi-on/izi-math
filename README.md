# izi-math

[GitHub Repository](https://github.com/izi-on/izi-math)

Cross-platform deterministic custom implementation of certain math operations:
- `sqrt` — bisection method
- `sin` — Taylor series with error bound
- `cos` — Taylor series with error bound

## Motivation

For some projects I need cross-platform determinism more than I need accuracy for these operations.
Also felt like applying some basic knowledge I learned in university.

## Installation

```bash
npm install izi-math
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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions, prerequisites, and how to add new functions.