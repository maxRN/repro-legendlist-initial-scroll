import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type RatFact = {
  id: string;
  text: string;
  upvotes: number;
  createdAt: number;
};

const STORAGE_KEY = 'rat-facts-v1';

const STARTER_FACTS: RatFact[] = [
  {
    id: 'starter-1',
    text: 'Rats are excellent swimmers and can tread water for up to three days.',
    upvotes: 6,
    createdAt: 1_720_000_001_000,
  },
  {
    id: 'starter-2',
    text: "A rat's front teeth never stop growing, so they must keep gnawing to trim them.",
    upvotes: 8,
    createdAt: 1_720_000_002_000,
  },
  {
    id: 'starter-3',
    text: 'Rats communicate with ultrasonic chirps that humans usually cannot hear.',
    upvotes: 5,
    createdAt: 1_720_000_003_000,
  },
];

function saveFacts(facts: RatFact[]) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
}

function loadFacts(): RatFact[] {
  if (typeof localStorage === 'undefined') {
    return STARTER_FACTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return STARTER_FACTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return STARTER_FACTS;
    }

    return parsed.filter((item): item is RatFact => {
      return (
        typeof item?.id === 'string' &&
        typeof item?.text === 'string' &&
        typeof item?.upvotes === 'number' &&
        typeof item?.createdAt === 'number'
      );
    });
  } catch {
    return STARTER_FACTS;
  }
}

export default function App() {
  const [facts, setFacts] = useState<RatFact[]>(STARTER_FACTS);
  const [newFact, setNewFact] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFacts(loadFacts());
  }, []);

  useEffect(() => {
    saveFacts(facts);
  }, [facts]);

  const sortedFacts = useMemo(() => {
    return [...facts].sort((a, b) => b.upvotes - a.upvotes || b.createdAt - a.createdAt);
  }, [facts]);

  const addFact = () => {
    const normalized = newFact.trim();
    if (normalized.length < 12) {
      setError('Fact needs at least 12 characters.');
      return;
    }

    setFacts((previous) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        text: normalized,
        upvotes: 0,
        createdAt: Date.now(),
      },
      ...previous,
    ]);

    setNewFact('');
    setError(null);
  };

  const upvoteFact = (factId: string) => {
    setFacts((previous) =>
      previous.map((fact) =>
        fact.id === factId
          ? {
              ...fact,
              upvotes: fact.upvotes + 1,
            }
          : fact,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Rat Facts</Text>
      <Text style={styles.subtitle}>Add facts and vote for the best rodent knowledge.</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Add a new fact</Text>
        <TextInput
          value={newFact}
          onChangeText={(value) => {
            setNewFact(value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Example: Rats can learn their names and come when called."
          multiline
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable style={styles.addButton} onPress={addFact}>
          <Text style={styles.addButtonText}>Submit fact</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {sortedFacts.map((fact) => (
          <View key={fact.id} style={styles.factCard}>
            <Text style={styles.factText}>{fact.text}</Text>
            <View style={styles.factFooter}>
              <Text style={styles.voteText}>{fact.upvotes} upvotes</Text>
              <Pressable style={styles.upvoteButton} onPress={() => upvoteFact(fact.id)}>
                <Text style={styles.upvoteButtonText}>+1 Upvote</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ff',
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2b124c',
  },
  subtitle: {
    fontSize: 15,
    color: '#5e4b82',
    marginBottom: 8,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d8d1ea',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#32175d',
  },
  input: {
    minHeight: 74,
    borderWidth: 1,
    borderColor: '#c9bddf',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: '#fbf9ff',
  },
  errorText: {
    color: '#b21838',
    fontSize: 12,
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#5a2ca0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 26,
    gap: 10,
  },
  factCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d8d1ea',
    gap: 10,
  },
  factText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#271040',
  },
  factFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  voteText: {
    fontWeight: '700',
    color: '#5e4b82',
  },
  upvoteButton: {
    backgroundColor: '#efe7ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  upvoteButtonText: {
    color: '#4b218c',
    fontWeight: '700',
  },
});
