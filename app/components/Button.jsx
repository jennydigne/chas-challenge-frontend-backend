import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyButton = ({ title, onPress, style, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      style={[
        styles.button,
        style,
        disabled && styles.buttonDisabled
      ]}
      disabled={false}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
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
