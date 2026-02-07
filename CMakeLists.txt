cmake_minimum_required(VERSION 3.13)
project(izi-math C)

set(CMAKE_C_STANDARD 17)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(math src/math.c)

target_link_options(math PRIVATE
  "SHELL:-s EXPORTED_FUNCTIONS=['_izi_sqrt','_izi_sin','_izi_cos','_malloc','_free']"
  "SHELL:-s EXPORTED_RUNTIME_METHODS=['cwrap','HEAPF64']"
  "SHELL:-s MODULARIZE=1"
  "SHELL:-s EXPORT_ES6=1"
  "SHELL:-s SINGLE_FILE=1"
  -O2
)

set_target_properties(math PROPERTIES
  SUFFIX ".mjs"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/dist"
)
