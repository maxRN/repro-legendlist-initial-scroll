import { LegendList } from '@legendapp/list/react-native';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SkeletonList } from '../components/SkeletonList';
import { createMockItems, type ListItem } from './types';

const LOAD_DELAY_MS = 500;
const ITEM_COUNT = 30;

/**
 * Repro 2: Leere Liste mit Skeleton-ListEmptyComponent, danach normale Daten.
 *
 * Die Liste startet mit data=[]. Während sie leer ist, wird ein typisches
 * Skeleton-Layout über ListEmptyComponent angezeigt. Nach ca. 500ms werden
 * die echten Listeneinträge geladen und normal gerendert.
 */
export function SkeletonEmptyListRepro() {
  const [data, setData] = useState<ListItem[]>([]);
  const [loadKey, setLoadKey] = useState(0);

  const loadData = useCallback(() => {
    setData([]);
    const timer = setTimeout(() => {
      setData(createMockItems(ITEM_COUNT));
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return loadData();
  }, [loadData, loadKey]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Repro 2: Skeleton ListEmptyComponent</Text>
        <Text style={styles.subtitle}>
          Skeleton bei leerer Liste · Daten nach {LOAD_DELAY_MS}ms
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => setLoadKey((current) => current + 1)}
        >
          <Text style={styles.buttonLabel}>Neu laden</Text>
        </Pressable>
      </View>
      <LegendList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        estimatedItemSize={72}
        ListEmptyComponent={SkeletonList}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
});
