const events = require("../DomainEvents");
const NotificationService = require("../../services/NotificationService");

// When someone adds a book to a To-Read list, notify the book owner
events.on("TO_READ_ADDED", async ({ ownerId, actorId, book }) => {
  try {
    await NotificationService.create({
      userId: ownerId,            // receiver
      actorId,                    // who triggered it
      eventType: "TO_READ_ADDED", // domain event
      entityType: "BOOK",
      entityId: book.id,          // GoogleBookId 
      message: `Someone added your book "${book.title}" to their To-Read list.`,
      metadata: { googleBookId: book.id, title: book.title, categories: book.categories 
       },/// added categories here (testing)
      type: "info",
    });
  } catch (err) {
    // keep handlers resilient; don't crash the app because of a notification
    console.error("Failed to create notification for TO_READ_ADDED:", err.message);
  }
});
