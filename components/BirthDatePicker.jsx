import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useState } from 'react';

const DateInput = ({ value, onChange }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (date) => {
    onChange(date); 
    hidePicker();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={showPicker}>
        <TextInput
          pointerEvents="none"
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={value ? formatDate(value) : ''}
          editable={false}
        />
      </Pressable>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        locale="sv-SE"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#787878",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
});

export default DateInput;
