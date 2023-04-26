import React, { useState, useEffect } from 'react';
import { View, Text , Button , Alert ,TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import firebase from '@react-native-firebase/app';
import firebaseConfig from './FirebaseConfig';

GoogleSignin.configure({
  scopes: ['email'],
  webClientId: '415928565252-b1cdbm9s480o6k6d6eu3orb7jbmujk4v.apps.googleusercontent.com',
  offlineAccess: true,
});
function App() {
  const [initializing, setInitializing] = useState(true);
  const [name, setName] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setName(userInfo?.user?.name);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    getCurrentUserInfo();  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    let app;
    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig)
    } else {
      app = firebase.app()
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
        <StatusBar backgroundColor={'#111'} />
        
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {name && <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:-50 }}>
                <Text style={{color:'black',fontWeight:'bold' }}>Hello {name}</Text>
            </View>}
            <TouchableOpacity 
                onPress={()=>{
                onGoogleButtonPress();
            }}>
                <View style={styles.loginWithGoogleButtonStyle}>

                    
                        <Image source={require('../../assets/images/google.png')}
                            style={{ height: 30.0, width: 30.0 }}
                            resizeMode="contain"
                        />
                        <Text style={{ ...Fonts.black15Medium, marginLeft: Sizes.fixPadding * 7.0,color:'black',width:'50%' }}>
                            Google
                        </Text>

                    
                </View>
            </TouchableOpacity> 
        </View>
        
    </SafeAreaView>
  );
}

export default App;
