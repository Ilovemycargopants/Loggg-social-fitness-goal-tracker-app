import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from "expo-router";

const GoalInformation = () => {
  const router = useRouter();
  console.log(router.params);
  const description = router.params;

  return (
    <View>
      
     
    </View>
  );
}

export default GoalInformation;
