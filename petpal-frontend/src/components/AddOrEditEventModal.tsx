import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddOrEditEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: {
    event_title: string;
    event_date: string;
    notes: string;
  }) => void;
  defaultDate: Date;
  existingEvent?: {
    id: number;
    title: string;
    date: string;
    notes: string;
  };
}

const AddOrEditEventModal: React.FC<AddOrEditEventModalProps> = ({
  visible,
  onClose,
  onSave,
  defaultDate,
  existingEvent,
}) => {
  const [eventTitle, setEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; notes?: string }>({});

  useEffect(() => {
    if (visible) {
      setErrors({});
      if (existingEvent) {
        setEventTitle(existingEvent.title);
        setSelectedDate(new Date(existingEvent.date));
        setNotes(existingEvent.notes);
      } else {
        setEventTitle('');
        setSelectedDate(defaultDate || new Date());
        setNotes('');
      }
      setShowDatePicker(false);
    }
  }, [visible, defaultDate, existingEvent]);

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!eventTitle.trim()) newErrors.title = 'Event title is required.';
    if (!notes.trim()) newErrors.notes = 'Notes are required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      event_title: eventTitle.trim(),
      event_date: selectedDate.toISOString().split('T')[0],
      notes: notes.trim(),
    });
    onClose();
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { width: screenWidth * 0.9 }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>
                {existingEvent ? 'Edit Event' : 'Add Event'}
              </Text>

              <TextInput
                placeholder="Event Title"
                placeholderTextColor="#666"
                style={[styles.input, errors.title && styles.inputError]}
                value={eventTitle}
                onChangeText={(text) => {
                  setEventTitle(text);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <Pressable onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}>
                <View style={styles.input}>
                  <Text style={{ color: '#0c1d1a' }}>
                    {selectedDate.toISOString().split('T')[0]}
                  </Text>
                </View>
              </Pressable>

              {showDatePicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    themeVariant="light"
                    onChange={(_, date) => {
                      if (date) setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    style={{ width: '100%' }}
                  />
                </View>
              )}

              <TextInput
                placeholder="Notes"
                placeholderTextColor="#666"
                style={[styles.input, errors.notes && styles.inputError]}
                value={notes}
                onChangeText={(text) => {
                  setNotes(text);
                  if (errors.notes) setErrors((prev) => ({ ...prev, notes: undefined }));
                }}
                multiline
              />
              {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    !(eventTitle.trim() && notes.trim()) && { opacity: 0.5 },
                  ]}
                  onPress={handleSave}
                  disabled={!(eventTitle.trim() && notes.trim())}
                >
                  <Text style={styles.buttonText}>
                    {existingEvent ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddOrEditEventModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    maxHeight: '90%',
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
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
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