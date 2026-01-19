import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure storage (native) + safe no-op fallback (web)
 */

export async function setSecureItem(key: string, value: any) {
  if (Platform.OS === 'web') return;

  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function getSecureItem<T>(key: string): Promise<T | null> {
  if (Platform.OS === 'web') return null;

  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) : null;
}

export async function removeSecureItem(key: string) {
  if (Platform.OS === 'web') return;

  await SecureStore.deleteItemAsync(key);
}
