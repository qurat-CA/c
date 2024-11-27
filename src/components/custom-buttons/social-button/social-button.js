import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import auth from '@react-native-firebase/auth';

import { Typography } from "../../../atom-components";
import { sizer } from "../../../helpers";
import { COLORS } from "../../../globals";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export default function SocialButton({
  text = "Continue with",
  icon = null,
  mT = 12,
  mB = 0,
  handlePress = () => { },
  type = ""
}) {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const { idToken } = await GoogleSignin.signIn();
      handlePress('google', idToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(statusCodes.SIGN_IN_CANCELLED);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(statusCodes.IN_PROGRESS);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
      } else {
        console.log(error, 'error');
      }
    }
  };

  const onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    handlePress('facebook', facebookCredential.token);
    return auth().signInWithCredential(facebookCredential);
  }


  const styleObj = {
    marginTop: sizer.moderateVerticalScale(mT),
    marginBottom: sizer.moderateVerticalScale(mB),
  };

  return (
    <TouchableOpacity
      style={[styles.container, styleObj]}
      onPress={() => {
        type === "google" ? handleGoogleSignIn() : type === "facebook" ? onFacebookButtonPress() : handlePress()
      }}
    >
      {icon && icon}
      <Typography text={text} size={14} bold color={COLORS.blackV2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: sizer.moderateVerticalScale(48),
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 13,
    flexDirection: "row",
  },
});
