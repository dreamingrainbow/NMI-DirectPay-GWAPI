const { gwapi } = require("./gwapi");

describe("Gateway API Test Suite", () => {
  var gw = new gwapi(() => {
    return "Test Callback.";
  });
  it("Class Initializes", () => {
    expect(gw).toBeDefined();
    expect(gw).toBeInstanceOf(gwapi);
  });

  it("Callback Works", () => {
    expect(typeof gw.cb).toBe("function");
    const callback = jest.fn(gw.cb);
    callback();
    expect(callback).toHaveReturned();
    expect(callback).toHaveReturnedWith("Test Callback.");
  });
});
