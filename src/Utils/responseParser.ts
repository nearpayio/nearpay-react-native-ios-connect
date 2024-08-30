export function parseAndTransformResponse<T>(response: string): T {
    return JSON.parse(response) as T;
  }

  export function parseAndTransformJOBResponse<T>(response: string): T {
    return JSON.parse(JSON.parse(response)) as T;
  }