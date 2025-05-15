import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
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
