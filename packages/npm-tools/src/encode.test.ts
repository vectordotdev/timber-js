import { atob, btoa } from "./encode";

describe("Encode function tests", () => {
  // Fixtures
  const ascii = "hello world";
  const base64 = "aGVsbG8gd29ybGQ=";

  it("should convert ASCII to Base64", () => {
    expect(atob(ascii)).toEqual(base64);
  });

  it("should convert Base64 to ASCII", () => {
    expect(btoa(base64)).toEqual(ascii);
  });
});
