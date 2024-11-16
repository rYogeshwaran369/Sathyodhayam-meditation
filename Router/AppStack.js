import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "../Pages/Authentication/Register";
import Login from "../Pages/Authentication/Login";
import Forgot from "../Pages/Authentication/Forgot";
import Home from "../Pages/Home";
import Newsfeeds from "../Pages/Newsfeeds";
import Podcasts from "../Pages/Podcasts";
import UserProfile from "../Pages/Profile";
import Meditation from "../Pages/Meditation/Meditation";
import Jabam from "../Pages/Meditation/Jabam";
import Meditationtimer from "../Pages/Meditation/Timers/Meditationtimer";
import Adminmenu from "../Pages/Admin/Adminmenu";
import Auserdetails from "../Pages/Admin/AddDetails/Auserdetails";
import Duserdetails from "../Pages/Admin/Details/Duserdetails";
import Anewsfeed from "../Pages/Admin/AddDetails/Anewsfeed";
import Dnewsfeed from "../Pages/Admin/Details/Dnewsfeed";
import Dslider from "../Pages/Admin/Details/Dslider";
import Apodcast from "../Pages/Admin/AddDetails/Apodcast";
import Dpodcast from "../Pages/Admin/Details/Dpodcast";
import Adhiyanam from "../Pages/Admin/AddDetails/Adhiyanam";
import Ddhiyanam from "../Pages/Admin/Details/Ddhiyanam";
import Ajabam from "../Pages/Admin/AddDetails/Ajabam";
import Djabam from "../Pages/Admin/Details/Djabam";
import Dthirayadhiyanam from "../Pages/Admin/Details/Dthirayadhiyanam";
import Athirayadhiyanam from "../Pages/Admin/AddDetails/Athirayadhiyanam";
import Meditator from "../Pages/Meditation/Triyadhiyanam/Meditator/Meditator";

const Stack = createStackNavigator();
export default function AppStack(){
    return(
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                options={{headerShown: false}}
                component={Login}/>
            <Stack.Screen
                name="Register"
                options={{headerShown: false}}
                component={Register}/>
            <Stack.Screen
                name="Forgot"
                options={{headerShown: false}}
                component={Forgot}/>
            <Stack.Screen
                name="Home"
                options={{headerShown: false}}
                component={Home}/>
            <Stack.Screen
                name="Newsfeeds"
                options={{headerShown: false}}
                component={Newsfeeds}/>
            <Stack.Screen
                name="Podcasts"
                options={{headerShown: false}}
                component={Podcasts}/>
            <Stack.Screen
                name="Userprofile"
                options={{headerShown: false}}
                component={UserProfile}/>
            <Stack.Screen
                name="Meditation"
                options={{headerShown: false}}
                component={Meditation}/>
            <Stack.Screen
                name="Jabam"
                options={{headerShown: false}}
                component={Jabam}/>
            <Stack.Screen
                name="Meditationtimer"
                options={{headerShown: false}}
                component={Meditationtimer}/>
            <Stack.Screen
                name="Adminmenu"
                options={{headerShown: false}}
                component={Adminmenu}/>
            <Stack.Screen
                name="Auserdetails"
                options={{headerShown: false}}
                component={Auserdetails}/>
            <Stack.Screen
                name="Duserdetails"
                options={{headerShown: false}}
                component={Duserdetails}/>
            <Stack.Screen
                name="Anewsfeed"
                options={{headerShown: false}}
                component={Anewsfeed}/>
            <Stack.Screen
                name="Dnewsfeed"
                options={{headerShown: false}}
                component={Dnewsfeed}/>
            <Stack.Screen
                name="Dslider"
                options={{headerShown: false}}
                component={Dslider}/>
            <Stack.Screen
                name="Apodcast"
                options={{headerShown: false}}
                component={Apodcast}/>
            <Stack.Screen
                name="Dpodcast"
                options={{headerShown: false}}
                component={Dpodcast}/>
            <Stack.Screen
                name="Adhiyanam"
                options={{headerShown: false}}
                component={Adhiyanam}/>
            <Stack.Screen
                name="Ddhiyanam"
                options={{headerShown: false}}
                component={Ddhiyanam}/>
            <Stack.Screen
                name="Ajabam"
                options={{headerShown: false}}
                component={Ajabam}/>
            <Stack.Screen
                name="Djabam"
                options={{headerShown: false}}
                component={Djabam}/>
            <Stack.Screen
                name="Athirayadhiyanam"
                options={{headerShown: false}}
                component={Athirayadhiyanam}/>
            <Stack.Screen
                name="Dthirayadhiyanam"
                options={{headerShown: false}}
                component={Dthirayadhiyanam}/>
            <Stack.Screen
                name="Meditator"
                options={{headerShown: false}}
                component={Meditator}/>
            
        </Stack.Navigator>
    )
}