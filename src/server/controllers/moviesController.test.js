const Movie = require("../../database/models/Movie");
const { getMovies } = require("./moviesController");

describe("Given a getMovies controller", () => {
  describe("When it receives a req and a res and it finds movies", () => {
    test("Then it should call res.json with the movies found", async () => {
      const movies = [
        {
          title: "Hola",
          year: 1999,
          type: "movie",
          image:
            "https://m.media-amazon.com/images/M/MV5BNTE3MDc1MjY4NV5BMl5BanBnXkFtZTgwMDg4MjQ4MTE@._V1_SX300.jpg",
          id: "6228796b92d232f647b99044",
        },
      ];

      const req = { query: { s: "Hola" } };
      const res = {
        json: jest.fn(),
      };

      Movie.find = jest.fn().mockResolvedValue(movies);
      await getMovies(req, res);

      expect(res.json).toHaveBeenCalledWith(movies);

      // Act
      // Assert
    });
  });
});
