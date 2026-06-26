export type ListItem = {
  id: string;
  title: string;
  subtitle: string;
};

export function createMockItems(count: number): ListItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    title: `Eintrag ${index + 1}`,
    subtitle: `Beschreibung für Eintrag ${index + 1}`,
  }));
}
