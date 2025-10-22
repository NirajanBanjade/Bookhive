const express = require("express");
const router = express.Router();

const { ToReadRepository } = require("../repositories/ToReadRepository");
const { UserInterestProfileRepository } = require("../repositories/UserInterestRepository");
const { ExistingBooksRepository } = require("../repositories/ExistingBooksRepository");
const { getVolume } = require("../services/googleBooks");
const { GoogleBooksAdapter } = require("../services/googleBooksAdapter");
const { Tokenizer } = require("../services/Tokenizer");
const { InterestProfileBuilder } = require("../services/InterestProfileBuilder");
const { RecommendationController } = require("../controllers/recommendationController");

// Candidate sources
const { AuthorSource } = require("../services/candidates/AuthorSource");
const { CategorySource } = require("../services/candidates/CategorySource");
const { KeywordSource } = require("../services/candidates/KeywordSource");
const { CandidateGenerator } = require("../services/candidates/CandidateGenerator");

// Dependency wiring (DIP)
const toReadRepo = new ToReadRepository({});
const profileRepo = new UserInterestProfileRepository({});
const existingRepo = new ExistingBooksRepository({});
const booksService = new GoogleBooksAdapter({});
const tokenizer = new Tokenizer({});
const builder = new InterestProfileBuilder({ toReadRepo, profileRepo, booksServiceGetVolume: getVolume, tokenizer });

// Sources
const authorSource = new AuthorSource({ booksService, perAuthor: 5, topAuthors: 5 });
const categorySource = new CategorySource({ booksService, perCategory: 5, topCategories: 5 });
const keywordSource = new KeywordSource({ booksService, perKeyword: 3, topKeywords: 12 });

const candidateGenerator = new CandidateGenerator({
  profileRepo,
  existingRepo,
  sources: [authorSource, categorySource, keywordSource],
  options: { concurrency: 3 }
});

const controller = new RecommendationController({ builder, profileRepo, candidateGenerator });

// Routes for managing user interest profiles
router.post("/profile/rebuild", controller.rebuildProfile);
router.get("/profile", controller.getProfile);
router.get("/candidates", controller.getCandidates);

module.exports = router;
