const { expect } = require("chai");
const sinon = require("sinon");

const { RecommendationService } = require("../services/RecommendationService");

describe("RecommendationService.recommend", () => {
  let candidateGenerator;
  let profileRepo;
  let featureExtractor;
  let scoring;
  let service;

  beforeEach(() => {
    candidateGenerator = {
      generate: sinon.stub(),
    };
    profileRepo = {
      getByUserId: sinon.stub(),
    };
    featureExtractor = {
      extract: sinon.stub(),
    };
    scoring = {
      score: sinon.stub(),
    };

    service = new RecommendationService({
      candidateGenerator,
      profileRepo,
      featureExtractor,
      scoring,
      builder: null, // we will stub _getFreshProfile directly
    });

    // Stub _getFreshProfile to always return a fake profile
    sinon.stub(service, "_getFreshProfile").resolves({ userId: "user-123" });
  });

  afterEach(() => sinon.restore());

  it("scores candidates, sorts by score desc, and respects limit", async () => {
    const userId = "user-123";

    // candidates from generator
    const candidates = [
      { id: "c1", source: "test", volumeInfo: { title: "Book 1" } },
      { id: "c2", source: "test", volumeInfo: { title: "Book 2" } },
      { id: "c3", source: "test", volumeInfo: { title: "Book 3" } },
    ];
    candidateGenerator.generate.resolves({ candidates });

    // feature extractor: simple echo
    featureExtractor.extract.callsFake((vi) => ({ title: vi.title }));

    // scoring: assign scores
    scoring.score
      .onCall(0).returns(0.2) // c1
      .onCall(1).returns(0.9) // c2
      .onCall(2).returns(0.5); // c3

    const result = await service.recommend({ userId, limit: 2 });

    // generator called with limit * 3
    expect(candidateGenerator.generate.calledOnceWith({
      userId,
      limit: 6,
    })).to.be.true;

    expect(result.reason).to.equal("ok");
    expect(result.items).to.have.lengthOf(2);
    expect(result.items.map((i) => i.id)).to.deep.equal(["c2", "c3"]);
  });
});
