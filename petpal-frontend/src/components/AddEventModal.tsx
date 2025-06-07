import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: { event_title: string; event_date: string; notes: string }) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [event_title, setEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (event_title && selectedDate && notes) {
      onSave({
        event_title,
        event_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        notes,
      });
      // reset fields
      setEventTitle('');
      setSelectedDate(null);
      setNotes('');
      onClose();
    }
  };

  const onDateChange = (_event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Event</Text>

          <TextInput
            placeholder="Event Title"
            style={styles.input}
            value={event_title}
            onChangeText={setEventTitle}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: 'center' }]}
          >
            <Text style={{ color: '#0c1d1a' }}>
              {selectedDate
                ? selectedDate.toISOString().split('T')[0]
                : 'Select Event Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <TextInput
            placeholder="Notes"
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddEventModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '85%',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0c1d1a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#e6f4f2',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#0c1d1a',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#f1f5f4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: '#00d1b2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  buttonText: {
    color: '#0c1d1a',
    fontWeight: '600',
    fontSize: 14,
  },
});