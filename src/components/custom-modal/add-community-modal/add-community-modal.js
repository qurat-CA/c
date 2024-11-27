import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ModalWrapper from "../modal-wrapper/modal-wrapper";
import { CameraIcon } from "../../../assets";
import { Typography } from "../../../atom-components";
import { InputField, PrimaryButton } from "../..";
import { sizer } from "../../../helpers";
import { baseOpacity, COLORS } from "../../../globals";
import { launchImageLibrary } from "react-native-image-picker";

const AddCommunityModal = ({
  visible,
  setVisible = () => {},
  handleChange = () => {},
  handleSave = () => {},
  formData = {},
  formError = {},
}) => {
  
  const options = {
    mediaType: "photo",
    includeBase64: false,
    maxHeight: 500,
    maxWidth: 500,
  };

  const setImageHandler = (imageName) => {
    launchImageLibrary(options, (res) => {
      if (res.assets) {
        handleChange(res.assets[0].uri, imageName);
      }
    });
  };

  return (
    <ModalWrapper isVisible={visible} setVisible={setVisible}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={baseOpacity}
        onPress={() => {
          setImageHandler("bannerImage");
        }}
      >
        <Image
          source={{
            uri: formData?.bannerImage,
          }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <CameraIcon />
          <Typography color={COLORS.white} size={11} mT={8}>
            Pick a banner Image
          </Typography>
        </View>
      </TouchableOpacity>
      <InputField
        label="Title"
        value={formData?.title}
        handleChange={(e) => handleChange(e, "title")}
        error={formError?.title}
        contextMenuHidden={true}
      />
      <InputField
        label="Description"
        value={formData?.description}
        handleChange={(e) => handleChange(e, "description")}
        error={formError?.description}
        contextMenuHidden={true}
      />
      <PrimaryButton label="Done" onPress={() => handleSave()} mt={8} mb={16} />
    </ModalWrapper>
  );
};

export default AddCommunityModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: sizer.moderateScale(10),
    padding: sizer.moderateScale(20),
    alignItems: "center",
  },
  container: {
    position: "relative",
    height: sizer.moderateVerticalScale(158),
    marginVertical: sizer.moderateVerticalScale(20),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
