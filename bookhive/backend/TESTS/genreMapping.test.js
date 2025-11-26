// backend/TESTS/genreMapping.test.js
const {
  GENRE_MAPPING,
  getGenreQuery,
  resolveGenreAlias,
} = require("../constants/genreMapping");

describe("Genre Mapping Functions", function () {
  this.timeout(10000);

  describe("getGenreQuery()", function () {
    it("returns correct query string for all 12 primary genres", function () {
      const expectedMappings = {
        fiction: "subject:Fiction",
        fantasy: "subject:Fantasy",
        mystery: "subject:Mystery",
        romance: "subject:Romance",
        scifi: "subject:Science Fiction",
        horror: "subject:Horror",
        biography: "subject:Biography",
        history: "subject:History",
        selfhelp: "subject:Self-Help",
        business: "subject:Business",
        cooking: "subject:Cooking",
        poetry: "subject:Poetry",
      };

      // Test each genre
      for (const [genreId, expectedQuery] of Object.entries(expectedMappings)) {
        const result = getGenreQuery(genreId);
        if (result !== expectedQuery) {
          throw new Error(
            `Genre mapping failed for '${genreId}': expected '${expectedQuery}', got '${result}'`
          );
        }
      }

      // Verify all 12 genres were tested
      const testedGenres = Object.keys(expectedMappings);
      if (testedGenres.length !== 12) {
        throw new Error(
          `Expected 12 genres, only tested ${testedGenres.length}`
        );
      }
    });

    it("returns null for invalid genre", function () {
      const invalidGenres = ["invalid", "notaGenre", "xyz123", ""];

      for (const invalidGenre of invalidGenres) {
        const result = getGenreQuery(invalidGenre);
        if (result !== null) {
          throw new Error(
            `Expected null for invalid genre '${invalidGenre}', got '${result}'`
          );
        }
      }
    });
  });

  describe("resolveGenreAlias()", function () {
    it("resolves common sci-fi aliases to 'scifi'", function () {
      const scifiAliases = [
        "sci-fi",
        "science-fiction",
        "sciencefiction",
        "Sci-Fi",
        "SCIENCE-FICTION",
      ];

      for (const alias of scifiAliases) {
        const result = resolveGenreAlias(alias);
        if (result !== "scifi") {
          throw new Error(
            `Alias resolution failed for '${alias}': expected 'scifi', got '${result}'`
          );
        }
      }
    });

    it("resolves all defined aliases correctly", function () {
      const aliasTests = [
        { input: "self-help", expected: "selfhelp" },
        { input: "bio", expected: "biography" },
        { input: "biographies", expected: "biography" },
        { input: "histories", expected: "history" },
        { input: "biz", expected: "business" },
        { input: "cook", expected: "cooking" },
        { input: "cookbooks", expected: "cooking" },
        { input: "poems", expected: "poetry" },
      ];

      for (const test of aliasTests) {
        const result = resolveGenreAlias(test.input);
        if (result !== test.expected) {
          throw new Error(
            `Alias '${test.input}' should resolve to '${test.expected}', got '${result}'`
          );
        }
      }
    });

    it("handles case-insensitive alias resolution", function () {
      const testCases = [
        { input: "SCI-FI", expected: "scifi" },
        { input: "Sci-Fi", expected: "scifi" },
        { input: "SELF-HELP", expected: "selfhelp" },
        { input: "Self-Help", expected: "selfhelp" },
        { input: "BIO", expected: "biography" },
        { input: "Bio", expected: "biography" },
      ];

      for (const test of testCases) {
        const result = resolveGenreAlias(test.input);
        if (result !== test.expected) {
          throw new Error(
            `Case-insensitive resolution failed for '${test.input}': expected '${test.expected}', got '${result}'`
          );
        }
      }
    });

    it("returns normalized input when no alias exists", function () {
      const testInputs = [
        "fiction",
        "mystery",
        "romance",
        "horror",
        "Fantasy",
        "POETRY",
      ];

      for (const input of testInputs) {
        const result = resolveGenreAlias(input);
        const expectedLowercase = input.toLowerCase();
        if (result !== expectedLowercase) {
          throw new Error(
            `Non-alias genre '${input}' should return lowercase '${expectedLowercase}', got '${result}'`
          );
        }
      }
    });

    it("handles empty and whitespace inputs", function () {
      const emptyInputs = ["", "   ", "\t", "\n"];

      for (const input of emptyInputs) {
        const result = resolveGenreAlias(input);
        const normalized = input.toLowerCase();
        if (result !== normalized) {
          throw new Error(
            `Empty/whitespace input should return normalized version, got '${result}'`
          );
        }
      }
    });
  });

  describe("GENRE_MAPPING constant", function () {
    it("contains exactly 12 genres", function () {
      const genreCount = Object.keys(GENRE_MAPPING).length;
      if (genreCount !== 12) {
        throw new Error(
          `Expected 12 genres in GENRE_MAPPING, found ${genreCount}`
        );
      }
    });

    it("all query strings start with 'subject:'", function () {
      for (const [genreId, queryString] of Object.entries(GENRE_MAPPING)) {
        if (!queryString.startsWith("subject:")) {
          throw new Error(
            `Genre '${genreId}' query string '${queryString}' does not start with 'subject:'`
          );
        }
      }
    });

    it("has unique query values for each genre", function () {
      const queryValues = Object.values(GENRE_MAPPING);
      const uniqueQueries = new Set(queryValues);

      if (queryValues.length !== uniqueQueries.size) {
        throw new Error(
          `Duplicate query values found in GENRE_MAPPING. Expected ${queryValues.length} unique values, found ${uniqueQueries.size}`
        );
      }
    });
  });
});
