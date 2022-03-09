const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectToMongoDB = require("../../database");
const app = require("../index");
const Movie = require("../../database/models/Movie");

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
  Movie.create({
    title: "Hola",
    type: "movie",
    actors: "protagonist supporting character",
    director: "movie director",
    genre: "drama",
    image:
      "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
    plot: "summary of the movie",
    runtime: 120,
    watchlist: "false",
    writer: "movie writers",
    year: 1999,
  });
  Movie.create({
    title: "Adeu",
    type: "movie",
    actors: "protagonist supporting character",
    director: "movie director",
    genre: "drama",
    image:
      "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
    plot: "summary of the movie",
    runtime: 120,
    watchlist: "false",
    writer: "movie writers",
    year: 1999,
  });
  Movie.create({
    title: "Batman2",
    type: "movie",
    actors: "protagonist supporting character",
    director: "movie director",
    genre: "drama",
    image:
      "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
    plot: "summary of the movie",
    runtime: 120,
    watchlist: "false",
    writer: "movie writers",
    year: 1999,
  });
});

afterEach(async () => {
  await Movie.deleteMany({});
});

describe("Given a moviesRouter", () => {
  describe("When it receives a get request at the movies?s=Hola endpoint", () => {
    test("Then it should respond with status 200", async () => {
      await request(app).get("/movies?s=Hola").expect(200);
    });
  });
  describe("When it receives a get request at the movies?s=HOLA endpoint", () => {
    test("Then it should respond with status 404", async () => {
      await request(app).get("/movies?s=HOLA").expect(404);
    });
  });
});
