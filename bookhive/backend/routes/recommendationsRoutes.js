const express = require("express");
const router = express.Router();

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
const toReadRepo = require('../repositories/ToReadRepository');
const collectionRepo = require('../repositories/CollectionRepository');
const profileRepo = new UserInterestProfileRepository({});
const existingRepo = new ExistingBooksRepository({});
const booksService = new GoogleBooksAdapter({});
const tokenizer = new Tokenizer({});
const builder = new InterestProfileBuilder({ toReadRepo, collectionRepo, profileRepo, booksServiceGetVolume: getVolume, tokenizer });

// Candidate Sources
const authorSource = new AuthorSource({ booksService, perAuthor: 5, topAuthors: 5 });
const categorySource = new CategorySource({ booksService, perCategory: 5, topCategories: 5 });
const keywordSource = new KeywordSource({ booksService, perKeyword: 3, topKeywords: 12 });

// Ranking pieces
const { FeatureExtractor } = require("../services/ranking/FeatureExtractor");
const { ScoringStrategy } = require("../services/ranking/ScoringStrategy");
const { RecommendationService } = require("../services/RecommendationService");

const candidateGenerator = new CandidateGenerator({
  profileRepo,
  existingRepo,
  sources: [authorSource, categorySource, keywordSource],
  options: { concurrency: 3 }
});

// Ranking
const featureExtractor = new FeatureExtractor({ tokenizer, options: { maxKeywords: 60 } });
const scoring = new ScoringStrategy({
  weights: { authors: 0.5, categories: 0.3, keywords: 0.2, popularity: 0.1, ratingQuality: 0.08, recency: 0.04 }
});
const recommendationService = new RecommendationService({
  candidateGenerator, profileRepo, featureExtractor, scoring, builder
});

const controller = new RecommendationController({ builder, profileRepo, candidateGenerator, recommendationService });

// Routes for managing user interest profiles
router.post("/profile/rebuild", controller.rebuildProfile);
router.get("/profile", controller.getProfile);
router.get("/candidates", controller.getCandidates);
router.get("/ranked", controller.getRecommendations);

module.exports = router;
