import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenHeight = Dimensions.get('window').height;

interface IDatePickerProps {
  label: string;
  error: string;
  value: Date | null;
  onChange: (date: Date) => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: string;
}

export const FormDatePicker: React.FC<IDatePickerProps> = ({
  label,
  error,
  value,
  onChange,
  icon,
  style = '',
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [show, setShow] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number>(
    value instanceof Date ? value.getMonth() : today.getMonth()
  );
  const [selectedDay, setSelectedDay] = useState<number>(
    value instanceof Date ? value.getDate() : today.getDate()
  );
  const [tempDate, setTempDate] = useState<Date>(
    new Date(currentYear, currentMonth, selectedDay)
  );

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const newDate = new Date(currentYear, currentMonth, day);
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const goToPrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    setCurrentMonth(newMonth);
    const maxDays = getDaysInMonth(currentYear, newMonth);
    if (selectedDay > maxDays) setSelectedDay(maxDays);
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    setCurrentMonth(newMonth);
    const maxDays = getDaysInMonth(currentYear, newMonth);
    if (selectedDay > maxDays) setSelectedDay(maxDays);
  };

  const formattedDisplay =
    value instanceof Date
      ? `${monthNames[value.getMonth()]} ${value.getDate()}`
      : 'Select Date';

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);
  const totalSlots = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return i - startDay + 1;
  });

  return (
    <View className={style} style={{ gap: 6 }}>
      {/* Label */}
      <Text className="text-[16px] font-[600] text-gray-800">{label}</Text>

      {/* Input */}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#E9EAEB',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 6,
          borderWidth: error ? 1 : 0,
          borderColor: error ? 'red' : 'transparent',
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color="#555"
          style={{ marginRight: 8 }}
        />
        <Text className="text-black">{formattedDisplay}</Text>
      </TouchableOpacity>

      {/* Error */}
      {error?.trim() !== '' && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}

      {/* Modal */}
      <Modal
        visible={show}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              height: screenHeight * 0.5,
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 16,
            }}
          >
            {/* Title */}
            <Text className="text-[18px] font-[700] text-center mb-4">
              Select Your Birth Day and Month
            </Text>

            {/* Month Selector */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <TouchableOpacity onPress={goToPrevMonth}>
                <MaterialCommunityIcons name="chevron-left" size={28} />
              </TouchableOpacity>
              <Text className="text-[16px] font-[600]">
                {monthNames[currentMonth]}
              </Text>
              <TouchableOpacity onPress={goToNextMonth}>
                <MaterialCommunityIcons name="chevron-right" size={28} />
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              {dayNames.map((day, idx) => (
                <Text
                  key={idx}
                  style={{
                    width: `${100 / 7}%`,
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#777',
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Day Grid */}
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  overflowY: "hidden"
                }}
              >
                {totalSlots.map((day, index) => {
                  if (day === null) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={{
                          width: `${100 / 7}%`,
                          aspectRatio: 1,
                          marginBottom: 10,
                        }}
                      />
                    );
                  }

                  const isSelected = selectedDay === day;

                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => handleSelectDay(day)}
                      style={{
                        width: `${100 / 7}%`,
                        aspectRatio: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        borderRadius: 4,
                        backgroundColor: isSelected ? '#FF6347' : undefined,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? 'white' : 'black',
                          fontWeight: '600',
                        }}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 0,
              }}
            >
              <TouchableOpacity
                onPress={handleCancel}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#ccc',
                  borderRadius: 25,
                  marginRight: 8,
                }}
              >
                <Text className="text-center text-black text-base font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#FF6347',
                  borderRadius: 25,
                  marginLeft: 8,
                }}
              >
                <Text className="text-center text-white text-base font-medium">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
