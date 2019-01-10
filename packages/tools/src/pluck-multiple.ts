/**
 * gets the value from source for given path
 *
 * @param source - object
 * @param path - string
 */
function get(source: object | any, path: string) {
  let segs: string[] = path.split(".");

  while (segs.length) {
    let seg: string | undefined = segs.shift();
    if (seg) {
      if (source[seg] === undefined) return undefined;
      source = source[seg];
    }
  }
  return source;
}

/**
 * sets the value for given path in the destination object
 *
 * @param destination - object
 * @param path - string
 * @param value - any
 */
function set(destination: { [key: string]: any }, path: string, value: any) {
  const segs: string[] = path.split(".");

  let seg: string | undefined = segs.shift();
  let next: { [key: string]: any } = {};

  if (seg) {
    if (destination[seg]) {
      next = destination[seg];
    } else {
      next = destination[seg] = !segs.length ? value : {};
    }
  }

  while (segs.length) {
    seg = segs.shift();
    if (seg) {
      if (!segs.length) {
        next[seg] = value;
      } else if (!next[seg]) {
        next[seg] = {};
      }
      next = next[seg];
    }
  }
}

/**
 * lets us request a 'path' of deeply nested object keys,
 * and returns just those keys in a new object
 *
 * @param source - object
 * @param paths - string[]
 */
export default function pluckMultiple(
  source: { [key: string]: any },
  paths: string[]
) {
  const destination = {};
  for (const path of paths) {
    set(destination, path, get(source, path));
  }
  return destination;
}
