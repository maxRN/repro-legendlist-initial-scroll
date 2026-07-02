import { boolean, capsule, endpoint, json, mutation, query, string, table } from "lakebed/server";
import { cleanCommentBody, FACTS, isFactId } from "../shared/facts";

export default capsule({
  name: "cat-facts",

  schema: {
    votes: table({
      factId: string(),
      userId: string(),
      up: boolean().default(true)
    }),
    comments: table({
      factId: string(),
      body: string(),
      authorId: string(),
      authorName: string()
    })
  },

  queries: {
    votes: query((ctx) => {
      const rows = ctx.db.votes.all();
      const counts: Record<string, { up: number; down: number }> = {};
      const mine: Record<string, "up" | "down"> = {};

      for (const row of rows) {
        const entry = (counts[row.factId] ??= { up: 0, down: 0 });
        if (row.up) {
          entry.up += 1;
        } else {
          entry.down += 1;
        }
        if (row.userId === ctx.auth.userId) {
          mine[row.factId] = row.up ? "up" : "down";
        }
      }

      return { counts, mine };
    }),

    comments: query((ctx) =>
      ctx.db.comments
        .orderBy("createdAt", "asc")
        .all()
        .map((row) => ({
          id: row.id,
          factId: row.factId,
          body: row.body,
          authorName: row.authorName,
          isMine: row.authorId === ctx.auth.userId,
          createdAt: row.createdAt
        }))
    )
  },

  mutations: {
    vote: mutation((ctx, factId: string, direction: "up" | "down") => {
      if (!isFactId(factId) || (direction !== "up" && direction !== "down")) {
        return;
      }

      const up = direction === "up";
      const existing = ctx.db.votes
        .where("factId", factId)
        .all()
        .find((row) => row.userId === ctx.auth.userId);

      if (!existing) {
        ctx.db.votes.insert({ factId, userId: ctx.auth.userId, up });
      } else if (existing.up === up) {
        // Voting the same direction again clears the vote.
        ctx.db.votes.delete(existing.id);
      } else {
        ctx.db.votes.update(existing.id, { up });
      }
    }),

    addComment: mutation((ctx, factId: string, body: string) => {
      const cleanBody = cleanCommentBody(body);
      if (!isFactId(factId) || !cleanBody) {
        return;
      }

      ctx.db.comments.insert({
        factId,
        body: cleanBody,
        authorId: ctx.auth.userId,
        authorName: ctx.auth.displayName
      });
    }),

    deleteComment: mutation((ctx, commentId: string) => {
      const comment = ctx.db.comments.get(commentId);
      if (!comment || comment.authorId !== ctx.auth.userId) {
        return;
      }

      ctx.db.comments.delete(commentId);
    })
  },

  endpoints: {
    randomFact: endpoint({ method: "GET", path: "/api/fact" }, () => {
      const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
      return json(fact);
    })
  }
});
