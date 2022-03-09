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
