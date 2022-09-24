import AsyncStorage from '@react-native-async-storage/async-storage';

export default abstract class StockData {
  public static async set(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  public static async get(key: string): Promise<string> {
    return (await AsyncStorage.getItem(key)) || '';
  }

  public static async exists(key: string): Promise<boolean> {
    return !!(await AsyncStorage.getItem(key));
  }

  public static async delete(key: string) {
    await AsyncStorage.removeItem(key);
  }
}
