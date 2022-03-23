const jwt = require("jsonwebtoken");
const auth = require("./auth");

jest.mock("jsonwebtoken");

describe("Given an auth middleware", () => {
  describe("When it receives a request without token", () => {
    test("Then it should call next with an error with message 'Token missing'", () => {
      const expectedError = new Error("Token missing");
      const req = {
        header: () => {},
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with the wrong token", () => {
    test("Then it should call next with an error", () => {
      const expectedError = new Error("");
      const req = {
        header: () => "Bearer invalidToken",
      };
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
