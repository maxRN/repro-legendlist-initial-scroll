export type CatFact = {
  id: string;
  text: string;
  category: "Body" | "Behavior" | "History" | "Science" | "Records";
};

export const FACTS: CatFact[] = [
  { id: "f01", text: "A cat's purr vibrates at 25 to 150 Hz, a frequency range shown to promote bone density and tissue healing.", category: "Science" },
  { id: "f02", text: "A group of cats is called a clowder, and a group of kittens is a kindle.", category: "Behavior" },
  { id: "f03", text: "Cats have 32 muscles in each ear and can rotate them 180 degrees to pinpoint sounds.", category: "Body" },
  { id: "f04", text: "Adult cats meow almost exclusively at humans. With each other they mostly rely on scent and body language.", category: "Behavior" },
  { id: "f05", text: "A cat's nose print is unique, just like a human fingerprint.", category: "Body" },
  { id: "f06", text: "The oldest known pet cat was buried alongside its human about 9,500 years ago in Cyprus, long before ancient Egypt.", category: "History" },
  { id: "f07", text: "Cats can jump up to six times their own body length in a single leap.", category: "Records" },
  { id: "f08", text: "Cats cannot taste sweetness. A genetic mutation broke their sweet receptors millions of years ago.", category: "Science" },
  { id: "f09", text: "Isaac Newton is often credited with inventing the cat flap, supposedly for his cat Spithead.", category: "History" },
  { id: "f10", text: "Cats walk like camels and giraffes: both right feet move first, then both left feet.", category: "Body" },
  { id: "f11", text: "A cat named Stubbs served as honorary mayor of Talkeetna, Alaska, for 20 years.", category: "History" },
  { id: "f12", text: "Cats spend 30 to 50 percent of their waking hours grooming themselves.", category: "Behavior" },
  { id: "f13", text: "A cat's whiskers are roughly as wide as its body, working as built-in gap gauges.", category: "Body" },
  { id: "f14", text: "Felicette, the first cat in space, launched on a French rocket in 1963 and returned safely.", category: "History" },
  { id: "f15", text: "Cats have around 230 bones, about 24 more than adult humans, and nearly 10 percent of them are in the tail.", category: "Body" },
  { id: "f16", text: "House cats can hit about 30 mph in short sprints, faster than the fastest human on record.", category: "Records" },
  { id: "f17", text: "Most adult cats are lactose intolerant, so the classic saucer of milk is actually a bad idea.", category: "Science" },
  { id: "f18", text: "Cats sweat through their paw pads. On hot days they can leave tiny damp paw prints.", category: "Body" },
  { id: "f19", text: "A cat's collarbone floats freely, which is why a cat can squeeze through any gap the size of its head.", category: "Body" },
  { id: "f20", text: "Cats also purr when stressed or injured. Purring appears to be self-soothing, not just a sign of contentment.", category: "Science" },
  { id: "f21", text: "Ancient Egyptian families shaved off their eyebrows to mourn the death of a household cat.", category: "History" },
  { id: "f22", text: "Cats can produce about 100 distinct vocal sounds. Dogs manage roughly 10.", category: "Records" },
  { id: "f23", text: "The technical term for a hairball is a bezoar.", category: "Science" },
  { id: "f24", text: "Cats have paw preferences: males tend to favor their left paw, females their right.", category: "Science" },
  { id: "f25", text: "The domestic cat shares about 95.6 percent of its genome with the tiger.", category: "Science" },
  { id: "f26", text: "Slow-blinking at a cat is a genuine signal of trust, and cats often slow-blink back.", category: "Behavior" },
  { id: "f27", text: "Cats can hear ultrasonic frequencies up to about 64 kHz, far beyond human and even dog hearing.", category: "Records" },
  { id: "f28", text: "Nikola Tesla said his fascination with electricity began with static sparks from his childhood cat, Macak.", category: "History" },
  { id: "f29", text: "The longest domestic cat ever measured was Mymains Stewart Gilligan at 123 cm, about four feet long.", category: "Records" },
  { id: "f30", text: "Cats knead with their paws as adults because it is a leftover comfort behavior from nursing as kittens.", category: "Behavior" },
  { id: "f31", text: "A cat's brain structure is about 90 percent similar to a human's, with a comparable cerebral cortex layout.", category: "Science" },
  { id: "f32", text: "Cats sleep 12 to 16 hours a day, which means a nine-year-old cat has been awake for only about three years of its life.", category: "Behavior" },
  { id: "f33", text: "Cats have a third eyelid, the haw, that sweeps in from the corner of the eye to protect and moisten it.", category: "Body" },
  { id: "f34", text: "The richest cat in history, Blackie, inherited seven million pounds from his owner in 1988.", category: "Records" },
  { id: "f35", text: "Cats chirp and chatter at birds through windows, a behavior thought to rehearse the killing bite.", category: "Behavior" },
  { id: "f36", text: "A cat's kidneys are efficient enough to filter seawater, something no human can do.", category: "Science" }
];

export const CATEGORIES: CatFact["category"][] = ["Body", "Behavior", "History", "Science", "Records"];

const factIds = new Set(FACTS.map((fact) => fact.id));

export function isFactId(value: string): boolean {
  return factIds.has(value);
}

export function cleanCommentBody(value: string): string {
  return value.trim().slice(0, 280);
}

export function factOfTheDay(dateISO: string): CatFact {
  let hash = 0;
  for (let i = 0; i < dateISO.length; i++) {
    hash = (hash * 31 + dateISO.charCodeAt(i)) >>> 0;
  }
  return FACTS[hash % FACTS.length];
}
