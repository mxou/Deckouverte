import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    width: '100%',
  },
  cardText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noCardsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default styles;