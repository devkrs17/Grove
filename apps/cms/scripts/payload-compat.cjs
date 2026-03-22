// Compatibility patches for running Payload CLI scripts with tsx on Node 20
// 1. CacheStorage: undici tries to create CacheStorage which conflicts with Node 20 built-ins
// 2. @next/env: tsx CJS interop doesn't set .default correctly for Payload's ESM import
if (typeof globalThis.CacheStorage === "undefined") {
  globalThis.CacheStorage = class CacheStorage {};
}

const Module = require("module");
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  const result = origLoad.call(this, request, parent, isMain);
  if (request === "@next/env" && result && !result.default) {
    result.default = result;
  }
  return result;
};
