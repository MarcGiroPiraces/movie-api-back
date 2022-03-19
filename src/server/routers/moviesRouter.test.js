require("dotenv").config();
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const connectToMongoDB = require("../../database");
const app = require("../index");
const Movie = require("../../database/models/Movie");
const User = require("../../database/models/user");

let token;
let database;
beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await connectToMongoDB(uri);
  Movie.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
  await database.stop();
});

beforeEach(async () => {
  await User.create({
    name: "name",
    username: "user1",
    password: "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
    movies: {},
  });

  const userDataToken = {
    username: "user1",
  };

  token = jwt.sign(userDataToken, process.env.JWT_SECRET);

  await User.create({
    name: "user2",
    username: "user2",
    password: "user2",
    movies: {},
  });

  Movie.create({
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
  Movie.create({
    Title: "Hello",
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
  Movie.create({
    Title: "Adeu",
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
  await Movie.deleteMany({});
});

describe("Given a moviesRouter", () => {
  describe("When it receives a get request at the movies?s=Hola endpoint", () => {
    test("Then it should respond with status 200", async () => {
      await request(app).get("/movies?s=Hola").expect(200);
    });
  });

  describe("When it receives a delete request at the right endpoint", () => {
    test("Then it should respond with status 200", async () => {
      const movies = await request(app).get("/movies?s=Hola");
      const { id } = movies.body[0];

      const { body } = await request(app)
        .delete(`/movies/${id}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveProperty("message");
    });
  });

  describe("When it receives a delete request at the wrong endpoint", () => {
    test("Then it should respond with status 200", async () => {
      const { body } = await request(app)
        .delete(`/movies/1234ljk`)
        .set("authorization", `Bearer ${token}`)
        .expect(404);

      expect(body).toHaveProperty("message");
    });
  });
});
