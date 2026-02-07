#!/bin/bash
set -e

mkdir -p build

# Configure with Emscripten's CMake wrapper
emcmake cmake -B build -S .

# Build
cmake --build build

# Symlink compile_commands.json to project root for the LSP
ln -sf build/compile_commands.json compile_commands.json

echo "✓ Build complete → dist/math.mjs"
