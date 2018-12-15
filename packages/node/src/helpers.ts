import { version } from "../package.json";

export function getUserAgent(): string {
  return `timber-js(node)/${version}`;
}
