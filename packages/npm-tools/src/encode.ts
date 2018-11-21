/**
 * Converts ASCII to Base64
 *
 * @param ascii - ASCII string -> base64
 */
export function atob(ascii: string): string {
  return Buffer.from(ascii).toString("base64");
}

/**
 * Converts Base64 to ASCII
 *
 * @param base64 - Base64 -> ASCII
 */
export function btoa(base64: string): string {
  return Buffer.from(base64, "base64").toString("ascii");
}
