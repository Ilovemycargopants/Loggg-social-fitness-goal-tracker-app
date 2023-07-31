import React from 'react'
import { View, Text } from 'react-native'
import {Stack, useRouter} from "expo-router"
import { Button, TouchableOpacity} from 'react-native'
import modalLogin from './modalLogin'
import Ionicons from '@expo/vector-icons/Ionicons';
import {COLORS,SHADOWS,SIZES,FONT} from '../constants'


const StackLayout = () => {
    const router = useRouter();
    return (
    <Stack screenOptions= {{
        headerStyle: {
            backgroundColor: COLORS.secondary
        },
        headerTintColor: "fff",
        headerTitleStyle:{
            fontWeight: "bold"
                
            
        },
    }}>
        
      <Stack.Screen
        name="index"
        options={{
          title: "Tutorial",
        }}
      />
    
        
       

<Stack.Screen 
    name = "(main)" 
    options = {{ 
        title: '',
        headerRight: () => (
            <TouchableOpacity 
            onPress={() => router.push('logCreation')}
            style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}
        >
            <Text style={{ color: 'white', marginLeft: 10 }}>New Log   </Text>
            <Ionicons name="bicycle-outline" size={25} color={"white"} />
            
        </TouchableOpacity>
        

        )
    }} 
/>



    
    <Stack.Screen name = "logCreation" options = {{presentation:"modal"}}/>
    
    </Stack>

    


    


    )

}

export default StackLayout
