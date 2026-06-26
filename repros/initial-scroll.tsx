import { LegendList } from '@legendapp/list/react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createMockItems, type ListItem } from './types';

const ITEM_COUNT = 1000;
const TARGET_INDEX = 750;

/**
 * Repro 1: initialScrollIndex mit asynchron geladenen Daten.
 *
 * Die Liste startet leer. Nach 500ms werden 1000 Einträge geladen.
 * initialScrollIndex ist von Anfang an auf 750 gesetzt.
 */
export function InitialScrollRepro() {
  const [data, setData] = useState<ListItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(createMockItems(ITEM_COUNT));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Repro 1: Initial Scroll</Text>
        <Text style={styles.subtitle}>
          initialScrollIndex={TARGET_INDEX} · Daten nach 500ms
        </Text>
      </View>
      <LegendList
        style={styles.list}
        data={data}
        initialScrollIndex={TARGET_INDEX}
        keyExtractor={(item) => item.id}
        estimatedItemSize={72}
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
