import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';



export default ()=> {
    
    return (
        <Tabs
  screenOptions={{
    tabBarStyle: {
      backgroundColor: 'transparent',
      tintColor: '#384160',
      alpha: 0.5,
      tabBarActiveTintColor: '#000FF',
    },
  }}
>
            <Tabs.Screen 
            name = "home"
            options = {{
                tabBarLabel: "Home",
                headerTitle: 'Logs',
                tabBarIcon: ({color,size}) => <Ionicons name = "home-outline" size ={size} color= {color}/>


            }} />

            <Tabs.Screen
            name = "shop"
            options = {{
                tabBarLabel: "Goals ",
                
                headerTitle: 'Goals',
                tabBarIcon: ({color,size}) => <Ionicons name = "medal-outline" size={size} color={color}/>


            }}
            />
             <Tabs.Screen
            name = "group"
            options = {{
                tabBarLabel: "Group ",
                headerTitle: 'Group',
                tabBarIcon: ({color,size}) => <Ionicons name = "people-outline" size={size} color={color}/>


            }}
            />
            <Tabs.Screen
            name = "profile"
            options = {{
                tabBarLabel: "Profile ",
                headerTitle: 'Profile',
                tabBarIcon: ({color,size}) => <Ionicons name = "person-outline" size={size} color={color}/>


            }}
            />
        </Tabs>



    )
}


