import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideButtons?: boolean;
  hideCancel?: boolean; // Add this prop
};

export default function CustomAlert({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  hideButtons = false,
  hideCancel = false, // Default to false
}: CustomAlertProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {!hideButtons && (
            <View style={styles.buttonRow}>
              {!hideCancel && (
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#222',
      padding: 24,
      borderRadius: 10,
      shadowColor: '#000',
    minWidth: 260,
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 12,
    color: '#f0735a',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#f0735a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});