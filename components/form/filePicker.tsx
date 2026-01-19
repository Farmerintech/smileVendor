import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilePickerProps {
  onFilePicked?: (file: DocumentPicker.DocumentPickerAsset) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFilePicked }) => {
  const [image, setImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // only accept images
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets?.length) {
        const selectedImage = result.assets[0];
        setImage(selectedImage);
        onFilePicked?.(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
      {image?.uri ? (
        <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Tap to pick image</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FilePicker;

const styles = StyleSheet.create({
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1F2A370D',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  placeholderText: {
    color: '#888',
    textAlign: 'center',
  },
});
