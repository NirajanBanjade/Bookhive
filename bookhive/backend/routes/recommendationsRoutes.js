const express = require("express");
const router = express.Router();

const { ToReadRepository } = require("../repositories/ToReadRepository");
const { UserInterestProfileRepository } = require("../repositories/UserInterestRepository");
const { getVolume } = require("../services/googleBooks");
const { Tokenizer } = require("../services/Tokenizer");
const { InterestProfileBuilder } = require("../services/InterestProfileBuilder");
const { RecommendationController } = require("../controllers/recommendationController");

// Dependency wiring (DIP)
const toReadRepo = new ToReadRepository({});
const profileRepo = new UserInterestProfileRepository({});
//const booksService = new getVolume({});
const tokenizer = new Tokenizer({});
const builder = new InterestProfileBuilder({ toReadRepo, profileRepo, booksServiceGetVolume: getVolume, tokenizer });

const controller = new RecommendationController({ builder, profileRepo });

// Routes for managing user interest profiles
router.post("/profile/rebuild", controller.rebuildProfile);
router.get("/profile", controller.getProfile);

module.exports = router;
