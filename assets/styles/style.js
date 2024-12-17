import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD2D2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    position: 'relative', // Par défaut, mais assure un bon positionnement
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#36206D',
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  deckContainer: {
    width: '100%',
    flexDirection: 'row',   // Affiche les éléments en ligne
    flexWrap: 'wrap',       // Permet le retour à la ligne
    justifyContent: 'space-between', // Espace égal entre les cartes
  },
  deckCard: {
    width: '48%',           // 48% pour avoir un espace entre les colonnes
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B2E83',
    marginBottom: 8,
  },
  deckInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  deckButton: {
    backgroundColor: '#E8407C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  deckButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: {
    position: 'absolute', 
    top: 15,              
    left: 10,             
    width: 230,             
    height: 80,            
    resizeMode: 'contain', // Conserve les proportions de l'image
    // borderWidth: 2,
    // borderColor: 'black',
},

});

export default styles;