require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
// const jwt = require("jsonwebtoken");
const databaseConnect = require("../../database");
const User = require("../../database/models/user");
const app = require("../index");
const Movie = require("../../database/models/Movie");

let database;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const connectionString = database.getUri();

  await databaseConnect(connectionString);
});

afterAll(() => {
  mongoose.connection.close();
  database.stop();
});

beforeEach(async () => {
  await User.create({
    name: "user",
    username: "user1",
    password: "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
    movies: {},
  });

  await User.create({
    name: "user2",
    username: "user2",
    password: "user2",
    movies: {},
  });

  await Movie.create({
    Title: "Hola",
    Type: "movie",
    Actors: "protagonist supporting character",
    Director: "movie director",
    Genre: "drama",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
    Plot: "summary of the movie",
    Runtime: 120,
    Writer: "movie writers",
    Year: "1999",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with a correct username and correct password", () => {
    test("Then it should return a token", async () => {
      const user = {
        name: "user",
        username: "user1",
        password: "user1",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it recevies a POST request with a wrong username", () => {
    test("Then it should respond with a 401", async () => {
      const user = {
        name: "ulaksjd",
        username: "afsjkdl",
        password: "user1",
      };
      const expectedError = {
        error: true,
        message: "Wrong username, user not found",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(404);

      expect(body).toHaveProperty("message", expectedError.message);
      expect(body).toHaveProperty("error", expectedError.error);
    });
  });

  describe("When it recevies a POST request with a wrong password", () => {
    test("Then it should respond with a 401", async () => {
      const user = {
        username: "user1",
        password: "fdasjo",
      };
      const expectedError = {
        error: true,
        message: "Wrong password",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(401);

      expect(body).toHaveProperty("message", expectedError.message);
      expect(body).toHaveProperty("error", expectedError.error);
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When it receives a request with a POST method and a new use on the body", () => {
    test("Then it should respond with a 201 status and the new user", async () => {
      const newUser = {
        username: "hola",
        name: "hola",
        password: "hola",
      };

      const { body } = await request(app)
        .post("/user/register")
        .send(newUser)
        .expect(201);

      expect(body).toHaveProperty("username", newUser.username);
    });
  });

  describe("When it receives a request with an existing username", () => {
    test("Then it should return a 409 status and 'Username already taken' error message", async () => {
      const expectedError = {
        error: true,
        message: "Username already taken",
      };
      const newUser = {
        username: "user1",
        name: "hola",
        password: "hola",
      };

      const { body } = await request(app)
        .post("/user/register")
        .send(newUser)
        .expect(409);

      expect(body).toEqual(expectedError);
    });
  });

  describe("When it receives a request with a missing username", () => {
    test("Then it should return a 400 status and 'Please fill the blank fields", async () => {
      const expectedError = {
        error: true,
        message: "Please fill the blank fields",
      };
      const newUser = {
        name: "hola",
        password: "hola",
      };

      const { body } = await request(app)
        .post("/user/register")
        .send(newUser)
        .expect(400);

      expect(body).toEqual(expectedError);
    });
  });
});
