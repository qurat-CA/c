import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import { Flex, Typography } from "../../atom-components";
import { sizer } from "../../helpers";
import { COLORS, CONSTANTS } from "../../globals";

const MessageItem = React.memo(({ item }) => {
  const { user } = useSelector((state) => state.storeReducer);
  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), "day")) {
      return `Today, ${date.format("hh:mm a")}`;
    } else {
      return date.format("MMM DD, hh:mm a");
    }
  };

  return (
    <View
      style={{
        alignItems:
          item.senderId == user?.details?.id ? "flex-end" : "flex-start",
        marginTop: sizer.moderateVerticalScale(10),
      }}
    >
      <View style={styles.cont}>
        <View
          style={[
            styles.main,
            {
              backgroundColor:
                item.senderId == user?.details?.id
                  ? COLORS.primary
                  : COLORS.greyV4,
            },
          ]}
        >
          <Typography
            text={item.content}
            size={13}
            LineHeight={15}
            color={
              item.senderId == user?.details?.id ? COLORS.white : COLORS.black
            }
          />
        </View>
      </View>

      <Flex algItems="center" gap={3} mt={5} jusContent="space-between">
        <Typography
          text={formatDate(item.createdAt)}
          size={10}
          color={COLORS.greyV3}
        />
        {item.senderId == user?.details?.id && (
          <Icon
            name="checkmark-done"
            size={sizer.fontScale(14)}
            color={item?.status === "read" ? COLORS.blue1 : COLORS.greyV3}
          />
        )}
      </Flex>
    </View>
  );
});

export default MessageItem;

const styles = StyleSheet.create({
  cont: {
    overflow: "hidden",
    marginRight: sizer.moderateScale(-CONSTANTS.containerPaddingX),
    paddingRight: sizer.moderateScale(CONSTANTS.containerPaddingX),
    marginLeft: sizer.moderateScale(-CONSTANTS.containerPaddingX),
    paddingLeft: sizer.moderateScale(CONSTANTS.containerPaddingX),
    marginTop: 3,
  },
  main: {
    maxWidth: "80%",
    paddingTop: sizer.moderateVerticalScale(14),
    paddingBottom: sizer.moderateVerticalScale(17),
    backgroundColor: "#EBEBEB",
    paddingHorizontal: sizer.moderateScale(16),
    justifyContent: "center",
    borderRadius: 6,
  },
});
