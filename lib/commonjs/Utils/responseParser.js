"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAndTransformJOBResponse = parseAndTransformJOBResponse;
exports.parseAndTransformResponse = parseAndTransformResponse;
function parseAndTransformResponse(response) {
  return JSON.parse(response);
}
function parseAndTransformJOBResponse(response) {
  return JSON.parse(JSON.parse(response));
}
//# sourceMappingURL=responseParser.js.map