import { capsule, mutation, query, string, table } from "lakebed/server";
import { cleanFactText } from "../shared/todo";

export default capsule({
  name: "lakebed-rat-facts",

  schema: {
    facts: table({
      text: string(),
      ownerId: string()
    }),
    votes: table({
      factId: string(),
      ownerId: string()
    })
  },

  queries: {
    facts: query((ctx) => {
      const facts = ctx.db.facts.orderBy("createdAt", "desc").all();
      const votes = ctx.db.votes.all();
      const voteCounts = new Map<string, number>();
      const votedByUser = new Set<string>();

      for (const vote of votes) {
        voteCounts.set(vote.factId, (voteCounts.get(vote.factId) ?? 0) + 1);
        if (vote.ownerId === ctx.auth.userId) {
          votedByUser.add(vote.factId);
        }
      }

      return facts
        .map((fact) => ({
          ...fact,
          upvotes: voteCounts.get(fact.id) ?? 0,
          hasUpvoted: votedByUser.has(fact.id)
        }))
        .sort((a, b) => b.upvotes - a.upvotes || Date.parse(b.createdAt) - Date.parse(a.createdAt));
    })
  },

  mutations: {
    addFact: mutation((ctx, text: string) => {
      const cleanText = cleanFactText(text);
      if (!cleanText) {
        return;
      }

      ctx.db.facts.insert({ text: cleanText, ownerId: ctx.auth.userId });
    }),
    upvoteFact: mutation((ctx, factId: string) => {
      const fact = ctx.db.facts.get(factId);
      if (!fact) {
        return;
      }

      const alreadyVoted = ctx.db.votes
        .where("ownerId", ctx.auth.userId)
        .all()
        .some((vote) => vote.factId === factId);

      if (alreadyVoted) {
        return;
      }

      ctx.db.votes.insert({
        factId,
        ownerId: ctx.auth.userId
      });
    })
  }
});
