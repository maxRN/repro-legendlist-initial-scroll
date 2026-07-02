import { useMutation, useQuery } from "lakebed/client";
import { useMemo, useState } from "preact/hooks";
import { CATEGORIES, cleanCommentBody, FACTS, factOfTheDay, type CatFact } from "../shared/facts";

type Votes = {
  counts: Record<string, { up: number; down: number }>;
  mine: Record<string, "up" | "down">;
};

type Comment = {
  id: string;
  factId: string;
  body: string;
  authorName: string;
  isMine: boolean;
  createdAt: string;
};

const CATEGORY_STYLES: Record<CatFact["category"], { chip: string; glow: string; emoji: string }> = {
  Body: { chip: "bg-rose-500/15 text-rose-300 border-rose-500/30", glow: "hover:border-rose-500/50", emoji: "\u{1F43E}" },
  Behavior: { chip: "bg-amber-500/15 text-amber-300 border-amber-500/30", glow: "hover:border-amber-500/50", emoji: "\u{1F638}" },
  History: { chip: "bg-violet-500/15 text-violet-300 border-violet-500/30", glow: "hover:border-violet-500/50", emoji: "\u{1F4DC}" },
  Science: { chip: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", glow: "hover:border-cyan-500/50", emoji: "\u{1F52C}" },
  Records: { chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", glow: "hover:border-emerald-500/50", emoji: "\u{1F3C6}" }
};

function CategoryChip({ category }: { category: CatFact["category"] }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.chip}`}>
      {style.emoji} {category}
    </span>
  );
}

function VoteButtons({ factId, votes, onVote }: { factId: string; votes: Votes | undefined; onVote: (id: string, direction: "up" | "down") => void }) {
  const counts = votes?.counts?.[factId] ?? { up: 0, down: 0 };
  const mine = votes?.mine?.[factId];

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-neutral-700">
      <button
        type="button"
        onClick={() => onVote(factId, "up")}
        title={mine === "up" ? "Remove upvote" : "Upvote"}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm transition-colors ${
          mine === "up" ? "bg-emerald-500/25 text-emerald-300" : "text-neutral-400 hover:bg-emerald-500/10 hover:text-emerald-300"
        }`}
      >
        {"\u{1F63B}"} <span className="tabular-nums">{counts.up}</span>
      </button>
      <span className="h-5 w-px bg-neutral-700" />
      <button
        type="button"
        onClick={() => onVote(factId, "down")}
        title={mine === "down" ? "Remove downvote" : "Downvote"}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm transition-colors ${
          mine === "down" ? "bg-rose-500/25 text-rose-300" : "text-neutral-400 hover:bg-rose-500/10 hover:text-rose-300"
        }`}
      >
        {"\u{1F640}"} <span className="tabular-nums">{counts.down}</span>
      </button>
    </div>
  );
}

function CommentThread({
  factId,
  comments,
  onAdd,
  onDelete
}: {
  factId: string;
  comments: Comment[];
  onAdd: (factId: string, body: string) => Promise<void>;
  onDelete: (commentId: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const body = cleanCommentBody(draft);
    if (!body || busy) {
      return;
    }

    setBusy(true);
    try {
      await onAdd(factId, body);
      setDraft("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-neutral-800 pt-4">
      {comments.length === 0 ? (
        <p className="mb-3 text-sm text-neutral-500">No comments yet. Be the first meow.</p>
      ) : (
        <ul className="mb-3 flex flex-col gap-2.5">
          {comments.map((comment) => (
            <li key={comment.id} className="group rounded-xl bg-neutral-800/60 px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-400">{comment.authorName}</span>
                {comment.isMine ? (
                  <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    className="text-xs text-neutral-600 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                  >
                    delete
                  </button>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-neutral-200">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
      <form className="flex gap-2" onSubmit={(event) => void submit(event)}>
        <input
          className="min-w-0 flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-400"
          maxLength={280}
          placeholder="Leave a meow..."
          value={draft}
          onInput={(event) => setDraft((event.currentTarget as HTMLInputElement).value)}
        />
        <button
          className="rounded-full border border-neutral-600 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:border-white hover:text-white disabled:opacity-50"
          disabled={busy || !draft.trim()}
          type="submit"
        >
          Post
        </button>
      </form>
    </div>
  );
}

function FactCard({
  fact,
  votes,
  comments,
  onVote,
  onAddComment,
  onDeleteComment
}: {
  fact: CatFact;
  votes: Votes | undefined;
  comments: Comment[];
  onVote: (id: string, direction: "up" | "down") => void;
  onAddComment: (factId: string, body: string) => Promise<void>;
  onDeleteComment: (commentId: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const style = CATEGORY_STYLES[fact.category];

  return (
    <article className={`flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur transition-colors ${style.glow}`}>
      <p className="flex-1 text-[15px] leading-relaxed text-neutral-200">{fact.text}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <CategoryChip category={fact.category} />
        <div className="flex items-center gap-2">
          <VoteButtons factId={fact.id} votes={votes} onVote={onVote} />
          <button
            type="button"
            onClick={() => setShowComments((open) => !open)}
            title={showComments ? "Hide comments" : "Show comments"}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
              showComments ? "border-sky-500/60 bg-sky-500/20 text-sky-300" : "border-neutral-700 text-neutral-400 hover:border-sky-500/40 hover:text-sky-300"
            }`}
          >
            {"\u{1F4AC}"} <span className="tabular-nums">{comments.length}</span>
          </button>
        </div>
      </div>
      {showComments ? <CommentThread comments={comments} factId={fact.id} onAdd={onAddComment} onDelete={onDeleteComment} /> : null}
    </article>
  );
}

export function App() {
  const votes = useQuery<Votes>("votes");
  const comments = useQuery<Comment[]>("comments");

  const vote = useMutation<[factId: string, direction: "up" | "down"], void>("vote");
  const addComment = useMutation<[factId: string, body: string], void>("addComment");
  const deleteComment = useMutation<[commentId: string], void>("deleteComment");

  const [filter, setFilter] = useState<CatFact["category"] | "All">("All");
  const [sort, setSort] = useState<"curated" | "top">("curated");
  const [spotlight, setSpotlight] = useState<CatFact>(() => factOfTheDay(new Date().toISOString().slice(0, 10)));
  const [isDaily, setIsDaily] = useState(true);

  const commentsByFact = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    for (const comment of comments ?? []) {
      (map[comment.factId] ??= []).push(comment);
    }
    return map;
  }, [comments]);

  const visibleFacts = useMemo(() => {
    const filtered = filter === "All" ? [...FACTS] : FACTS.filter((fact) => fact.category === filter);
    if (sort === "top") {
      const score = (fact: CatFact) => {
        const counts = votes?.counts?.[fact.id];
        return counts ? counts.up - counts.down : 0;
      };
      filtered.sort((a, b) => score(b) - score(a));
    }
    return filtered;
  }, [filter, sort, votes]);

  const totalVotes = useMemo(
    () => Object.values(votes?.counts ?? {}).reduce((sum, entry) => sum + entry.up + entry.down, 0),
    [votes]
  );

  function shuffle() {
    let next = spotlight;
    while (next.id === spotlight.id) {
      next = FACTS[Math.floor(Math.random() * FACTS.length)];
    }
    setSpotlight(next);
    setIsDaily(false);
  }

  function onVote(factId: string, direction: "up" | "down") {
    void vote(factId, direction);
  }

  async function onAddComment(factId: string, body: string) {
    await addComment(factId, body);
  }

  function onDeleteComment(commentId: string) {
    void deleteComment(commentId);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-14">
        <header className="mb-10 text-center">
          <p className="mb-3 text-6xl" aria-hidden="true">{"\u{1F408}"}</p>
          <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Cat Facts
          </h1>
          <p className="mt-3 text-neutral-400">
            {FACTS.length} scientifically purr-viewed facts.{" "}
            {totalVotes > 0 ? `${totalVotes} votes and ${(comments ?? []).length} meows so far.` : "Vote and leave a meow."}
          </p>
        </header>

        <section className="mb-12 overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/80 via-neutral-900 to-neutral-950 p-8 shadow-2xl shadow-violet-950/40">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              {isDaily ? "\u2728 Fact of the day" : "\u{1F3B2} Random fact"}
            </span>
            <CategoryChip category={spotlight.category} />
          </div>
          <p className="text-2xl font-medium leading-snug text-neutral-100 sm:text-3xl">{spotlight.text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={shuffle}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Show me another {"\u{1F431}"}
            </button>
            <VoteButtons factId={spotlight.id} votes={votes} onVote={onVote} />
          </div>
        </section>

        <nav className="mb-4 flex flex-wrap justify-center gap-2">
          {(["All", ...CATEGORIES] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === category
                  ? "border-white bg-white text-neutral-950"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-400 hover:text-white"
              }`}
            >
              {category === "All" ? "All" : `${CATEGORY_STYLES[category].emoji} ${category}`}
            </button>
          ))}
        </nav>

        <div className="mb-8 flex justify-center gap-1 text-sm">
          {(
            [
              ["curated", "Curated order"],
              ["top", "\u{1F525} Top voted"]
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={`rounded-full px-3.5 py-1 transition-colors ${
                sort === value ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFacts.map((fact) => (
            <FactCard
              key={fact.id}
              comments={commentsByFact[fact.id] ?? []}
              fact={fact}
              votes={votes}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onVote={onVote}
            />
          ))}
        </section>

        <footer className="mt-16 text-center text-sm text-neutral-600">
          <p>
            Vote {"\u{1F63B}"} or {"\u{1F640}"} and leave a meow — everything is shared live with every visitor. Random fact API at{" "}
            <a className="text-neutral-400 underline decoration-dotted hover:text-white" href="api/fact">/api/fact</a>.
          </p>
        </footer>
      </div>
    </main>
  );
}
