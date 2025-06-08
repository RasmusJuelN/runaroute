import { View, Text, StyleSheet } from 'react-native';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      {/* Add your statistics content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
});