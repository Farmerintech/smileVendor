import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface ISELECT {
  items: string[];
  label: string;
  error: string;
  style?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
}

export const FormSelect: React.FC<ISELECT> = ({
  items,
  label,
  error,
  style = '',
  icon,
  selectedValue,
  onValueChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: string) => {
    onValueChange(item);
    setModalVisible(false);
  };

  return (
    <View className={`flex-col ${style}`}>
      {/* Label */}
      <Text className="text-base font-medium text-gray-700 mb-1">{label}</Text>

      {/* Trigger */}
      <TouchableOpacity
        className={`flex-row items-center bg-stone-100 px-[16px] py-[12px] rounded-[8px] ${
          error?.trim() !== '' ? 'border border-red-500' : 'border border-transparent'
        }`}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name={icon} size={20} color="#555" style={{ marginRight: 8 }} />
        <Text className="text-black flex-1">{selectedValue || 'Select..'}</Text>
        <MaterialCommunityIcons
          name={modalVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error?.trim() !== '' && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}

      {/* Modal Dropdown */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:"#E9EAEB",
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              maxHeight: '60%',
              padding: 16,
            }}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    borderBottomColor: '#e5e7eb',
                    borderBottomWidth: 1,
                  }}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
