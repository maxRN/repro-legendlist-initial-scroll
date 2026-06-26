import { StyleSheet, View } from 'react-native';

const SKELETON_ROW_COUNT = 8;

function SkeletonRow() {
  return (
    <View style={styles.row}>
      <View style={styles.avatar} />
      <View style={styles.textBlock}>
        <View style={[styles.line, styles.titleLine]} />
        <View style={[styles.line, styles.subtitleLine]} />
      </View>
    </View>
  );
}

export function SkeletonList() {
  return (
    <View style={styles.container}>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <SkeletonRow key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  titleLine: {
    width: '70%',
  },
  subtitleLine: {
    width: '45%',
  },
});
