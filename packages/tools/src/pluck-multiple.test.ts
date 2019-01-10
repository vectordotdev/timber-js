import pluckMultiple from "./pluck-multiple";

describe("pluck multiple tests", () => {
  it("should return an obj with given paths", () => {
    const paths = ["length"];
    const source = {
      length: 40,
      message: null,
    };

    const expected = { length: 40 };
    expect(pluckMultiple(source, paths)).toEqual(expected);
  });

  it("should return an obj with given paths when nested ctx is given", () => {
    const paths = ["length", "request.headers", "response.status"];
    const source = {
      request: {
        secure: true,
        headers: { "content-type": "text/plain" },
        href: "http://google.com/?q=whatever",
      },
      response: { status: 200 },
      length: 40,
      message: null,
    };

    const expected = {
      request: {
        headers: { "content-type": "text/plain" },
      },
      length: 40,
      response: { status: 200 },
    };
    expect(pluckMultiple(source, paths)).toEqual(expected);
  });

  it("should set undefined in destination if source does not have the path requested", () => {
    const paths = ["length", "request.headers", "response.status", "foo.bar"];
    const source = {
      request: {
        secure: true,
        headers: { "content-type": "text/plain" },
        href: "http://google.com/?q=whatever",
      },
      response: { status: 200 },
      length: 40,
      message: null,
    };

    const expected = {
      request: {
        headers: { "content-type": "text/plain" },
      },
      length: 40,
      response: { status: 200 },
      foo: {
        bar: undefined,
      },
    };
    expect(pluckMultiple(source, paths)).toEqual(expected);
  });

  it("shoudl work with path with same root like request.headers request.href", () => {
    const paths = [
      "length",
      "request.headers",
      "request.href",
      "request.body.text",
      "request.body.json.username",
      "request.body.json.address.pin",
      "response.status",
      "foo.bar",
    ];

    const source = {
      request: {
        secure: true,
        headers: { "content-type": "text/plain" },
        href: "http://google.com/?q=whatever",
        body: {
          json: {
            username: "user123",
            address: {
              street: "str str",
              pin: 300011,
            },
          },
          text: "",
        },
      },
      response: { status: 200 },
      length: 40,
      message: null,
    };

    const expected = {
      request: {
        headers: { "content-type": "text/plain" },
        href: "http://google.com/?q=whatever",
        body: {
          json: {
            username: "user123",
            address: {
              pin: 300011,
            },
          },
          text: "",
        },
      },
      length: 40,
      response: { status: 200 },
      foo: {
        bar: undefined,
      },
    };
    expect(pluckMultiple(source, paths)).toEqual(expected);
  });
});
