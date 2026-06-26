import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InitialScrollRepro } from './repros/initial-scroll';
import { SkeletonEmptyListRepro } from './repros/skeleton-empty-list';

type ReproId = 'initial-scroll' | 'skeleton-empty-list';

const REPROS: { id: ReproId; label: string }[] = [
  { id: 'initial-scroll', label: '1 · Initial Scroll' },
  { id: 'skeleton-empty-list', label: '2 · Skeleton Empty' },
];

export default function App() {
  const [activeRepro, setActiveRepro] = useState<ReproId>('skeleton-empty-list');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.tabBar}>
        {REPROS.map((repro) => {
          const isActive = activeRepro === repro.id;

          return (
            <Pressable
              key={repro.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveRepro(repro.id)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {repro.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.content}>
        {activeRepro === 'initial-scroll' ? (
          <InitialScrollRepro />
        ) : (
          <SkeletonEmptyListRepro />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#374151',
  },
  tabLabelActive: {
    color: '#fff',
  },
});
