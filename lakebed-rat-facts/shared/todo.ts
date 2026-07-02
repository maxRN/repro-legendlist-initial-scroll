export type RatFact = {
  id: string;
  text: string;
  ownerId: string;
  upvotes: number;
  hasUpvoted: boolean;
  createdAt: string;
  updatedAt: string;
};

export function cleanFactText(value: string): string {
  return value.trim().slice(0, 240);
}
