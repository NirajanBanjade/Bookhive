const { expect } = require("chai");
const sinon = require("sinon");

const { ExistingBooksRepository } = require("../repositories/ExistingBooksRepository");

describe("ExistingBooksRepository.getAllSavedGoogleIds", () => {
  let fakeToRead;
  let fakeCollection;
  let repo;

  beforeEach(() => {
    fakeToRead = { findOne: sinon.stub() };
    fakeCollection = { findOne: sinon.stub() };

    repo = new ExistingBooksRepository({
      toReadModel: fakeToRead,
      collectionModel: fakeCollection,
    });
  });

  afterEach(() => sinon.restore());

  it("merges To-Read, currently-reading, and completed ids with deduplication", async () => {
    fakeToRead.findOne.resolves({
      books: [
        { googleBookId: "A" },
        { googleBookId: "B" },
      ],
    });

    fakeCollection.findOne.resolves({
      books: [
        { googleBookId: "B", status: "currently-reading" }, // duplicate
        { googleBookId: "C", status: "completed" },
        { googleBookId: "D", status: "to-read" },           // should be ignored
        { title: "No ID" },                                 // ignored
      ],
    });

    const result = await repo.getAllSavedGoogleIds("user-123");

    expect(result).to.be.instanceOf(Set);
    expect(result.size).to.equal(3);
    expect(result.has("A")).to.be.true;
    expect(result.has("B")).to.be.true;
    expect(result.has("C")).to.be.true;
    expect(result.has("D")).to.be.false;

    // optional: validate queries
    expect(fakeToRead.findOne.calledOnce).to.be.true;
    expect(fakeCollection.findOne.calledOnce).to.be.true;
  });
});
