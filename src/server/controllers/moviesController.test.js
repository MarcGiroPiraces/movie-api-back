const mockingoose = require("mockingoose");
const fs = require("fs");
const Movie = require("../../database/models/Movie");
const { getMovies, deleteMovie, createMovie } = require("./moviesController");

jest.mock("firebase/storage", () => ({
  getStorage: () => "holaa",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

afterEach(() => {
  mockingoose.resetAll();
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

      Movie.create = jest.fn().mockResolvedValue("123");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await createMovie(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
});

// describe("Given a createMovie controller", () => {
//   describe("When it receives a request with the wrong body", () => {
//     test("Then it should call res.json", async () => {
//       const next = jest.fn();
//       const error = new Error("We couldn't create the movie");
//       error.code = 400;
//       const req = {
//         body: {
//           Actors: "protagonist supporting character",
//           Director: "movie director",
//           Genre: "drama",
//           Plot: "summary of the movie",
//           Poster:
//             "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZT",
//           Runtime: 120,
//           Type: "movie",
//           Writer: "movie writers",
//           Year: "1999",
//         },
//       };

//       Movie.create = jest.fn().mockResolvedValue(null);
//       await createMovie(req, null, next);

//       expect(next).toHaveBeenCalledWith(error);
//     });
//   });
// });
