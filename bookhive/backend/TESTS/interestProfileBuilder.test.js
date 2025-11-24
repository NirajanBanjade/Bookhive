const { expect } = require("chai");
const sinon = require("sinon");

const { InterestProfileBuilder } = require("../services/InterestProfileBuilder");

describe("InterestProfileBuilder.buildForUser", () => {
  let toReadRepo;
  let collectionRepo;
  let profileRepo;
  let getVolume;
  let tokenizer;
  let builder;

  beforeEach(() => {
    toReadRepo = {
      getBooksForUser: sinon.stub(),
    };
    collectionRepo = {
      getBooksByStatus: sinon.stub(),
    };
    profileRepo = {
      upsert: sinon.stub(),
    };
    getVolume = sinon.stub();
    tokenizer = {
      tokens: sinon.stub(),
    };

    builder = new InterestProfileBuilder({
      toReadRepo,
      collectionRepo,
      profileRepo,
      booksServiceGetVolume: getVolume,
      tokenizer,
      options: { maxKeywords: 100 },
    });
  });

  afterEach(() => sinon.restore());

  it("builds a normalized author and category profile and persists it", async () => {
    const userId = "user-123";

    // 1) Saved books
    toReadRepo.getBooksForUser.resolves([
      { googleBookId: "A" },
      { googleBookId: "B" },
    ]);
    collectionRepo.getBooksByStatus.withArgs(userId, "currently-reading").resolves([]);
    collectionRepo.getBooksByStatus.withArgs(userId, "completed").resolves([]);

    // 2) Volumes
    getVolume.withArgs("A").resolves({
      volumeInfo: {
        authors: ["Alice"],
        categories: ["Fantasy"],
        description: "magic dragon",
      },
    });
    getVolume.withArgs("B").resolves({
      volumeInfo: {
        authors: ["Alice", "Bob"],
        categories: ["Fantasy", "Horror"],
        description: "dragon knight",
      },
    });

    // 3) Tokenizer splits & lowercases
    tokenizer.tokens.callsFake((text) =>
      text.toLowerCase().split(/\s+/).filter(Boolean)
    );

    // 4) upsert stub returns stored profile
    const fakeProfileDoc = { _id: "p1", userId };
    profileRepo.upsert.resolves(fakeProfileDoc);

    const { profile, warnings } = await builder.buildForUser(userId);

    expect(warnings).to.deep.equal([]);
    expect(profile).to.equal(fakeProfileDoc);

    // Check that upsert was called with expected structure
    expect(profileRepo.upsert.calledOnceWith(
      userId,
      sinon.match({
        userId,
        authors: sinon.match.array,
        categories: sinon.match.array,
        keywords: sinon.match.array,
        sourceCounts: {
          toRead: 2,
          currentlyReading: 0,
          finished: 0,
        },
      })
    )).to.be.true;

    const upsertArgs = profileRepo.upsert.firstCall.args[1];
    const authors = upsertArgs.authors;
    const categories = upsertArgs.categories;

    const alice = authors.find((a) => a.name === "alice");
    const bob = authors.find((a) => a.name === "bob");
    expect(alice.weight).to.equal(1);
    expect(bob.weight).to.be.closeTo(0.5, 1e-6);

    const fantasy = categories.find((c) => c.name === "fantasy");
    const horror = categories.find((c) => c.name === "horror");
    expect(fantasy.weight).to.equal(1);
    expect(horror.weight).to.be.closeTo(0.5, 1e-6);
  });
});
