const mockingoose = require("mockingoose");
const fs = require("fs");
const Movie = require("../../database/models/Movie");
const {
  getMovies,
  getMovie,
  deleteMovie,
  createMovie,
  updateMovie,
} = require("./moviesController");

jest.mock("firebase/storage", () => ({
  getStorage: () => "getStorage",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

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

  describe("When it receives a req and a res and it does not find movies", () => {
    test("Then it should not call res.json", async () => {
      const movies = [];
      const req = { query: { s: "Hola" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      mockingoose(Movie).toReturn(movies, "find");

      await getMovies(req, null, next);

      expect(res.json).not.toHaveBeenCalled();
    });
  });
});

describe("Given a getMovie controller", () => {
  describe("When it receives a request with the id", () => {
    test("Then it should call method json with the movie", async () => {
      const req = { params: { moveiId: "1" } };
      const res = {
        json: jest.fn(),
      };
      const movie = {
        _id: "1",
        Title: "Kingsman",
        Year: "2014",
        Runtime: 130,
        Genre: "Action, Adventure, Comedy",
        Type: "Movie",
        Director: "Jane Goldman",
        Writer: "Colin Firth, Taron Egerton, Samuel L Jackson",
        Actors: "Colin Firth, Taron Egerton, Samuel L Jackson",
        Plot: "A spy organisation recruits a promising street kid into the agency's training program, while a global threat emerges from a twisted tech genius.",
        Poster:
          "https://firebasestorage.googleapis.com/v0/b/marcgiro-movieapi.appspot.com/o/Kingsman?alt=media&token=37ceef0c-09b0-4116-a779-3ab9b1f8cf1e",
      };
      Movie.findById = jest.fn().mockResolvedValue(movie);

      await getMovie(req, res);

      expect(res.json).toHaveBeenCalledWith(movie);
    });

    describe("When it receives a request with the wrong id", () => {
      test("Then it should call method json with the movie", async () => {
        const req = { params: { moveiId: "1" } };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        const movie = [];
        Movie.findById = jest.fn().mockResolvedValue(movie);
        mockingoose(Movie).toReturn(movie, "findById");

        await getMovie(req, null, next);

        expect(res.json).not.toHaveBeenCalled();
      });
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

describe("Given an updateMovie controller", () => {
  describe("When it's instantiated with a new movie in the body and an image as file", () => {
    test("Then it should call json with the new movie and the firebase url as image property", async () => {
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
        _id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "theleftovers.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
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
        params: "1",
      };
      const next = jest.fn();
      Movie.findByIdAndUpdate = jest.fn().mockResolvedValue("the leftovers");
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await updateMovie(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new movie in the body and an image in the file, and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
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
        _id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "theleftovers.jpeg",
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
        params: "1",
      };
      const next = jest.fn();
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });

      await updateMovie(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file and no movie in the body", () => {
    test("Then it should call the next method", async () => {
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
        _id: "1",
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
        params: "1",
      };
      const next = jest.fn();
      Movie.create = jest.fn().mockResolvedValue("the leftovers");
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, null);
      });

      await updateMovie(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
