import { useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  reasons?: string[];
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

const DEFAULT_REASONS = [
  "Item no longer available",
  "Store closed",
  "Price has changed",
  "Out of stock",
];

export const RejectionReasonModal = ({
  visible,
  reasons = DEFAULT_REASONS,
  onClose,
  onSubmit,
}: Props) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  // Custom reason takes priority
  const finalReason = customReason.trim() || selectedReason;

  const handlePresetSelect = (reason: string) => {
    setSelectedReason(reason);
    setCustomReason(""); // 🔑 unpick custom input
  };

  const handleCustomChange = (text: string) => {
    setCustomReason(text);
    if (text.trim().length > 0) {
      setSelectedReason(null); // 🔑 unpick preset reason
    }
  };

  const handleSubmit = () => {
    if (!finalReason) return;
    onSubmit(finalReason);
    setSelectedReason(null);
    setCustomReason("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center px-6">
        <View className="bg-white rounded-2xl p-5">
          <Text className="text-lg font-semibold mb-4">
            Reason for Rejection
          </Text>

          {/* Preset Reasons */}
          {reasons.map(reason => (
            <Pressable
              key={reason}
              onPress={() => handlePresetSelect(reason)}
              className="flex-row items-center mb-3"
            >
              <View
                className={`w-5 h-5 rounded-full border mr-3 ${
                  selectedReason === reason
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-400"
                }`}
              />
              <Text>{reason}</Text>
            </Pressable>
          ))}

          {/* Custom Reason */}
          <TextInput
            placeholder="Or type a custom reason..."
            value={customReason}
            onChangeText={handleCustomChange}
            multiline
            className="border border-gray-300 rounded-xl p-3 mt-3 h-[80px]"
          />

          {/* Actions */}
          <View className="flex-row justify-end gap-3 mt-5">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!finalReason}
              className={`px-4 py-2 rounded-xl ${
                finalReason ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-semibold">Reject Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
