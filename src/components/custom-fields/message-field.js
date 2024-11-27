import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";

import { EmojiIcon, SendDocument, SendIcon } from "../../assets";
import { sizer } from "../../helpers";
import { COLORS, baseOpacity } from "../../globals";
import { Flex } from "../../atom-components";
import { ActivityIndicator } from "react-native-paper";
import { useState } from "react";

const MessageField = ({
  messageSendHandler,
  messageText,
  setMessageText,
  sendLoading,
  comment = false,
  placeholder = "Type your message here.",
}) => {
  const [inputHeight, setInputHeight] = useState(
    sizer.moderateVerticalScale(44)
  );

  const disabledBtn = () => {
    if (sendLoading || !(messageText || "")?.trim()) {
      return true;
    }
    return false;
  };

  return (
    <Flex
      gap={10}
      pt={29}
      pb={25}
      flexStyle={styles.main}
      extraStyles={
        comment && {
          backgroundColor: COLORS.white,
          paddingTop: sizer.moderateVerticalScale(16),
          paddingBottom: sizer.moderateVerticalScale(16),
        }
      }
    >
      <View style={[styles.container, { height: inputHeight }]}>
        {/* <SendDocument /> */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.text}
          style={[styles.input, { height: inputHeight }]}
          value={messageText}
          multiline
          onContentSizeChange={(e) => {
            const newHeight =
              e.nativeEvent.contentSize.height +
              sizer.moderateVerticalScale(10);
            if (newHeight <= sizer.moderateVerticalScale(155)) {
              setInputHeight(newHeight);
            }
          }}
          onChangeText={(value) => {
            setMessageText(value);
          }}
        />
        {/* <EmojiIcon /> */}
      </View>
      <View style={styles.sendBtnContainer}>
        <TouchableOpacity
          activeOpacity={baseOpacity}
          style={[
            styles.sendBtn,
            { backgroundColor: disabledBtn() ? COLORS.greyV3 : COLORS.primary },
          ]}
          disabled={disabledBtn()}
          onPress={() => {
            messageSendHandler();
            setMessageText("");
            setInputHeight(sizer.moderateVerticalScale(44));
          }}
        >
          {sendLoading ? (
            <ActivityIndicator color={COLORS.white} size={20} />
          ) : (
            <SendIcon />
          )}
        </TouchableOpacity>
      </View>
    </Flex>
  );
};

export default MessageField;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.lightblueV1,
    marginHorizontal: sizer.moderateScale(-15),
    paddingHorizontal: sizer.moderateScale(16),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#8E8E931F",
    borderRadius: sizer.fontScale(10),
    // paddingHorizontal: sizer.moderateScale(16),
    // height: sizer.moderateVerticalScale(43),
  },
  input: {
    flex: 1,
    marginHorizontal: sizer.moderateScale(13),
    color: COLORS.black,
    // textAlignVertical: "top",
  },
  sendBtn: {
    width: sizer.moderateScale(48),
    height: sizer.moderateVerticalScale(47),
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
