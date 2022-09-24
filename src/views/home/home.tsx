import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Home() {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: any) => (
        <Text {...props}>Lista de reproducción</Text>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.view}>
      <Text>HOME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
