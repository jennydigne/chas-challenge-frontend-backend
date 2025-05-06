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
    backgroundColor: '#5B5B5B', 
    paddingVertical: 12,
    borderRadius: 10,
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
