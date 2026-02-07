# Contributing to izi-math

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

## Adding new C functions

1. Add your function to `src/math.c` using `double` params and return type, marked with `EMSCRIPTEN_KEEPALIVE`
2. Add `"_your_function_name"` to the `EXPORTED_FUNCTIONS` list in `build.sh`
3. Add a `cwrap` call in `index.js` and export a wrapper
4. Add the TypeScript signature to `index.d.ts`
5. Run `npm run build`
