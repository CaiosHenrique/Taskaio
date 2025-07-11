import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface FloatingHeaderProps {
  title: string;
  subtitle?: string;
}

export function FloatingHeader({ title, subtitle }: FloatingHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Ionicons name="star" size={36} color="#A1CEDC" style={styles.icon} />
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingVertical: 24,
    paddingHorizontal: 0,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    zIndex: 10,
    width: '100%',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  subtitle: {
    fontSize: 15,
    color: '#4A6572',
    marginTop: 4,
  },
});
