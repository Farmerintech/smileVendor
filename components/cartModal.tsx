import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MPROPS {
  visible: boolean;
  source: any;
  price: number;
  count: number;
  onAdd: () => void;
  onReduce: () => void;
  onAddToCart: () => void;
  onRequestClose: () => void;
}

const { height } = Dimensions.get("window");

export const CartModal = ({
  visible,
  source,
  price,
  count,
  onAdd,
  onReduce,
  onAddToCart,
  onRequestClose,
}: MPROPS) => {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              <View style={styles.imageWrapper}>
                <Image source={source} style={styles.image} />
                <TouchableOpacity
                  onPress={onRequestClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>Item</Text>
                <Text style={styles.subtitle}>₦{price}</Text>

                <View style={styles.buttonRow}>
                  <View style={styles.quantityButton}>
                    <Text style={styles.icon} onPress={onReduce}>−</Text>
                    <Text style={styles.quantityText}>{count}</Text>
                    <Text style={styles.icon} onPress={onAdd}>+</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={onAddToCart}
                  >
                    <Text style={styles.addButtonText}>
                      Add ₦{price * count}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "white",
    height: height * 0.6,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  imageWrapper: {
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    color: "#555",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  quantityButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#093131",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#093131",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
