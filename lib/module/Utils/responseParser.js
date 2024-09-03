export function parseAndTransformResponse(response) {
  return JSON.parse(response);
}
export function parseAndTransformJOBResponse(response) {
  return JSON.parse(JSON.parse(response));
}
//# sourceMappingURL=responseParser.js.map