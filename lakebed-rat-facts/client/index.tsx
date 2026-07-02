import { SignInWithGoogle, signOut, useAuth, useMutation, useQuery } from "lakebed/client";
import { useState } from "preact/hooks";
import { cleanFactText, type RatFact } from "../shared/todo";

const STARTER_FACTS = [
  "Rats can learn their own names and come when called.",
  "Rats use their whiskers to help map spaces in the dark.",
  "Rats are social animals and often sleep in groups.",
  "A rat can squeeze through a gap about the size of a coin.",
  "Rats can laugh in ultrasonic chirps when tickled.",
  "Rats are capable of empathy and may help trapped cage-mates.",
  "Rats can tread water for long periods and are strong swimmers.",
  "Rats memorize routes and can navigate complex mazes quickly."
];

function AuthAvatar({ label, picture }: { label: string; picture?: string }) {
  const initial = label.trim().slice(0, 1).toUpperCase() || "?";

  if (picture) {
    return (
      <img
        alt=""
        className="h-7 w-7 shrink-0 rounded-full border border-neutral-800 bg-neutral-900 object-cover"
        referrerPolicy="no-referrer"
        src={picture}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300"
    >
      {initial}
    </span>
  );
}

function FactsPage() {
  const facts = useQuery<RatFact[]>("facts");
  const addFact = useMutation<[text: string], void>("addFact");
  const upvoteFact = useMutation<[factId: string], void>("upvoteFact");
  const [formError, setFormError] = useState("");
  const [submitLabel, setSubmitLabel] = useState("Add fact");

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const text = cleanFactText(String(data.get("text") ?? ""));
    if (!text || text.length < 3) {
      setFormError("Please enter at least 3 characters.");
      return;
    }

    setSubmitLabel("Adding...");
    try {
      await addFact(text);
      form.reset();
      setFormError("");
      setSubmitLabel("Added!");
      setTimeout(() => setSubmitLabel("Add fact"), 900);
    } catch {
      setFormError("Could not add the fact. Please try again.");
      setSubmitLabel("Add fact");
    }
  }

  return (
    <section>
      <h1 className="mb-3 text-5xl font-bold tracking-tight">Rat Facts</h1>
      <p className="mb-8 text-neutral-400">Submit fun rat facts and upvote your favorites.</p>
      <form className="mb-8 flex gap-3" onSubmit={(event) => void onSubmit(event)}>
        <input
          className="min-w-0 flex-1 border border-neutral-700 bg-black px-3 py-2 text-white outline-none focus:border-white"
          name="text"
          placeholder="Rats can laugh when tickled."
          onInput={() => {
            if (formError) {
              setFormError("");
            }
          }}
        />
        <button className="border border-white px-4 py-2 font-medium" type="submit">{submitLabel}</button>
      </form>
      {formError ? <p className="mb-6 text-sm text-red-300">{formError}</p> : null}
      <ul className="space-y-3">
        {STARTER_FACTS.map((fact) => (
          <li className="border border-neutral-800 p-4" key={fact}>
            <p className="mb-3">{fact}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-400">starter fact</span>
            </div>
          </li>
        ))}
        {facts.map((fact) => (
          <li className="border border-neutral-800 p-4" key={fact.id}>
            <p className="mb-3">{fact.text}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-400">{fact.upvotes} upvotes</span>
              <button
                className="border border-white px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:border-neutral-700 disabled:text-neutral-600"
                disabled={fact.hasUpvoted}
                type="button"
                onClick={() => void upvoteFact(fact.id)}
              >
                {fact.hasUpvoted ? "Upvoted" : "+1 Upvote"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function App() {
  const auth = useAuth();
  const authLabel = auth.displayName;
  const authStatus = auth.isLoading && auth.isGuest ? "checking session" : "signed in as " + authLabel;

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {!auth.isLoading ? <AuthAvatar label={authLabel} picture={auth.picture} /> : null}
            <p className="min-w-0 truncate font-mono text-sm text-neutral-500">{authStatus}</p>
          </div>
          {!auth.isLoading && auth.isGuest ? (
            <SignInWithGoogle className="shrink-0 border border-neutral-700 px-3 py-1.5 text-sm font-medium text-neutral-200 hover:border-white hover:text-white" />
          ) : !auth.isLoading ? (
            <button className="shrink-0 text-sm text-neutral-400 hover:text-white" type="button" onClick={() => signOut()}>
              Sign out
            </button>
          ) : null}
        </div>
        <FactsPage />
      </section>
    </main>
  );
}
