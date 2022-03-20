const mockingoose = require("mockingoose");
const fs = require("fs");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const request = require("supertest");
// const { mongoose } = require("mongoose");
const Movie = require("../../database/models/Movie");
const {
  getMovies,
  deleteMovie,
  createMovie,
  // updateMovie,
} = require("./moviesController");
// const connectToMongoDB = require("../../database");
// const app = require("..");

jest.mock("firebase/storage", () => ({
  getStorage: () => "getStorage",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

// let database;
beforeAll(async () => {
  // database = await MongoMemoryServer.create();
  // const uri = database.getUri();
  // await connectToMongoDB(uri);
  Movie.deleteMany({});
});
afterAll(async () => {
  // await mongoose.connection.close();
  // await database.stop();
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

describe("Given a getMovies controller", () => {
  describe("When it receives a req and a res and it finds movies", () => {
    test("Then it should call res.json with the movies found", async () => {
      const movies = [
        {
          Title: "Hola",
          Year: "1999",
          Type: "movie",
          Poster:
            "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
          Genre: "drama",
        },
      ];

      const moviesFiltered = [
        expect.objectContaining({
          Title: "Hola",
          Year: "1999",
          Type: "movie",
          Poster:
            "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
        }),
      ];

      const req = { query: { s: "Hola" } };
      const res = {
        json: jest.fn(),
      };

      mockingoose(Movie).toReturn(movies, "find");
      await getMovies(req, res);

      expect(res.json).toHaveBeenCalledWith(moviesFiltered);
    });
  });
});

describe("Given a deleteMovies controller", () => {
  describe("When it receives a request with the right id", () => {
    test("Then it should call res.json", async () => {
      const message = { message: "Movie deleted" };
      const req = { params: { movieId: "lkasjdg34" } };
      const res = {
        json: jest.fn(),
      };

      Movie.findByIdAndDelete = jest.fn().mockResolvedValue(res.json);
      await deleteMovie(req, res);

      expect(res.json).toHaveBeenCalledWith(message);
    });
  });
  describe("When it receives a request without the right id", () => {
    test("Then it should send an error", async () => {
      const next = jest.fn();
      const error = new Error(
        "We couldn't find the movie you requested to delete"
      );
      error.code = 404;
      const req = { params: { movieId: "lkasjdg34" } };

      Movie.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      await deleteMovie(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createMovie controller", () => {
  describe("When it is instantiated with a new movie in the body of the request and an image in the file of the request", () => {
    test("Then it should call json with some info of the new movie and the firebase url in the Poster property", async () => {
      const newFile = {
        fieldname: "photo",
        originalname: "the leftovers.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const newMovie = {
        Title: "the leftovers",
        Genre: "drama",
        Type: "series",
        Actors: "A lot of actors",
        Director: "Great director",
        Writer: "Damon Lindelof",
        Year: "1999",
        Runtime: "2000",
        Plot: "Great show",
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });
      const req = {
        body: newMovie,
        file: newFile,
      };
      const next = jest.fn();

      Movie.create = jest.fn().mockResolvedValue("please pass");
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });
      await createMovie(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new movie in the body of the request, an image in the file of the request and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
      const newFile = {
        fieldname: "photo",
        originalname: "the leftovers.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const newMovie = {
        Title: "the leftovers",
        Genre: "drama",
        Type: "series",
        Actors: "A lot of actors",
        Director: "Great director",
        Writer: "Damon Lindelof",
        Year: "1999",
        Runtime: "2000",
        Plot: "Great show",
      };
      const req = {
        body: newMovie,
        file: newFile,
      };
      const next = jest.fn();

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });
      await createMovie(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with the file property and no info of the movie on body property", () => {
    test("Then it should call next with an error", async () => {
      const newFile = {
        fieldname: "photo",
        originalname: "the leftovers.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const req = {
        file: newFile,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
        callback();
      });
      await createMovie(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When an error occurs renaming the file", () => {
    test("Then it should call the next method with an error", async () => {
      const newMovie = {
        Title: "the leftovers",
        Genre: "drama",
        Type: "series",
        Actors: "A lot of actors",
        Director: "Great director",
        Writer: "Damon Lindelof",
        Year: "1999",
        Runtime: "2000",
        Plot: "Great show",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "the leftovers.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const req = {
        body: newMovie,
        file: newFile,
      };
      const next = jest.fn();

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      await createMovie(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

// describe("Given an updateMovie controller", () => {
//   describe("When it receives a request with the right body", () => {
//     test.only("Then it should call json method with the movie updated", async () => {
//       const updatedMovie = {
//         Title: "the leftovers updated",
//         Genre: "drama",
//         Type: "series",
//         Actors: "A lot of actors",
//         Director: "Great director",
//         Writer: "Damon Lindelof",
//         Year: "1999",
//         Runtime: "2000",
//         Plot: "Great show",
//       };
//       const newFile = {
//         fieldname: "photo",
//         originalname: "cristianito.jpeg",
//         encoding: "7bit",
//         mimetype: "image/jpeg",
//         destination: "uploads/",
//         filename: "93ec034d18753a982e662bc2fdf9a584",
//         path: "uploads/93ec034d18753a982e662bc2fdf9a584",
//         size: 8750,
//       };

//       const movies = await request(app).get("/movies");
//       const { id } = movies.body[0];

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest
//         .spyOn(fs, "rename")
//         .mockImplementation((oldpath, newpath, callback) => {
//           callback();
//         });

//       const req = {
//         body: updatedMovie,
//         file: newFile,
//         params: id,
//       };
//       const next = jest.fn();
//       Movie.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

//       jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
//         callback(null, newFile);
//       });

//       await updateMovie(req, res, next);

//       expect(res.json).toHaveBeenCalled();
//     });
//   });

// describe("When the rename function throw an error", () => {
//   test("Then it should call next method", async () => {
//     const newPlayer = {
//       name: "Benzema",
//       number: 7,
//       goals: 21,
//       assists: 3,
//       yellowCards: 4,
//       redCards: 1,
//       totalMatches: 21,
//       position: "Pívote",
//       id: "1",
//     };
//     const newFile = {
//       fieldname: "photo",
//       originalname: "cristianito.jpeg",
//       encoding: "7bit",
//       mimetype: "image/jpeg",
//       destination: "uploads/",
//       filename: "93ec034d18753a982e662bc2fdf9a584",
//       path: "uploads/93ec034d18753a982e662bc2fdf9a584",
//       size: 8750,
//     };

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest
//       .spyOn(fs, "rename")
//       .mockImplementation((oldpath, newpath, callback) => {
//         callback("error");
//       });

//     const req = {
//       body: newPlayer,
//       file: newFile,
//       params: "1",
//     };
//     const next = jest.fn();
//     Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

//     await updatePlayer(req, res, next);

//     expect(next).toHaveBeenCalled();
//   });
// });

// describe("When the readFile function throw an error", () => {
//   test("Then it should call next method", async () => {
//     const newPlayer = {
//       name: "Benzema",
//       number: 7,
//       goals: 21,
//       assists: 3,
//       yellowCards: 4,
//       redCards: 1,
//       totalMatches: 21,
//       position: "Pívote",
//       id: "1",
//     };
//     const newFile = {
//       fieldname: "photo",
//       originalname: "cristianito.jpeg",
//       encoding: "7bit",
//       mimetype: "image/jpeg",
//       destination: "uploads/",
//       filename: "93ec034d18753a982e662bc2fdf9a584",
//       path: "uploads/93ec034d18753a982e662bc2fdf9a584",
//       size: 8750,
//     };

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest
//       .spyOn(fs, "rename")
//       .mockImplementation((oldpath, newpath, callback) => {
//         callback();
//       });

//     const req = {
//       body: newPlayer,
//       file: newFile,
//       params: "1",
//     };
//     const next = jest.fn();
//     Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

//     jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
//       callback("error");
//     });

//     await updatePlayer(req, res, next);

//     expect(next).toHaveBeenCalled();
//   });
// });

// describe("When it receives a req with an user but doesn't has file", () => {
//   test("Then it should call json method with the new player", async () => {
//     const newPlayer = {
//       name: "Benzema",
//       number: 7,
//       goals: 21,
//       assists: 3,
//       yellowCards: 4,
//       redCards: 1,
//       totalMatches: 33,
//       position: "Cierre",
//       id: "1",
//     };

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest
//       .spyOn(fs, "rename")
//       .mockImplementation((oldpath, newpath, callback) => {
//         callback();
//       });

//     const req = {
//       body: newPlayer,
//       file: null,
//       params: "1",
//     };
//     const next = jest.fn();
//     Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

//     jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
//       callback(null, req.file);
//     });

//     await updatePlayer(req, res, next);

//     expect(res.json).toHaveBeenCalled();
//   });
// });

// describe("When it's instantiated without a player", () => {
//   test("Then it should call the next method with an error", async () => {
//     const newFile = {
//       fieldname: "photo",
//       originalname: "cristianito.jpeg",
//       encoding: "7bit",
//       mimetype: "image/jpeg",
//       destination: "uploads/",
//       filename: "93ec034d18753a982e662bc2fdf9a584",
//       path: "uploads/93ec034d18753a982e662bc2fdf9a584",
//       size: 8750,
//     };

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest
//       .spyOn(fs, "rename")
//       .mockImplementation((oldpath, newpath, callback) => {
//         callback();
//       });

//     const req = {
//       file: newFile,
//       params: "1452334",
//     };
//     const next = jest.fn();
//     Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

//     jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
//       callback(null, req.file);
//     });

//     await updatePlayer(req, res, next);

//     expect(next).toHaveBeenCalled();
//   });
// });
// });
