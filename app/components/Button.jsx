import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#693ED6', 
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  text: {
    color: '#FAFAFA', 
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MyButton;
