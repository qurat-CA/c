import { Fragment, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";

import { Flex, Typography } from "../../atom-components";
import { VoltzIconSmall, VoltzIconSmallV2 } from "../../assets";
import DonationModal from "../custom-modal/donate-modal/donation-modal";
import OutlineButton from "../custom-buttons/outline-button/outline-button";
import { sizer } from "../../helpers";
import { COLORS, baseOpacity, placeholder_cover_img } from "../../globals";
import DonationAvatarGroup from "../donation-avatar-group/donation-avatar-group";
import { calculateDonationPercentage } from "../../utils";
import format from "pretty-format";
import CardDetailModal from "../custom-modal/card-detail-modal/card-detail-modal";
import { useCheckLoginStatus, useRegisterUnRegister } from "../../hooks";
import CampaignStatus from "../../atom-components/campaign-status";

const SuggestedCharityCard = ({
  handlePress = () => {},
  setDonationSuccess = () => {},
  data,
  small = true,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [paymentApiUrl, setPaymentApiUrl] = useState("");
  const [register, setRegister] = useState(false);
  const { registerUnRegister, isLoading } = useRegisterUnRegister();
  const { checkLoginStatus } = useCheckLoginStatus();
  const campaignStatus = CampaignStatus(data);

  const handleFollow = async (id, action) => {
    if (checkLoginStatus()) {
      const success = await registerUnRegister(id, action);
      if (success) setRegister(action === "register");
    }
  };

  useEffect(() => {
    setRegister(data?.registered);
  }, [data?.registered]);

  const getStatusColor = (status) => {
    switch (status) {
      case "attended":
        return COLORS.green1;
      case "registered":
        return COLORS.blue1;
      case "missed":
        return COLORS.dangerV3;
      default:
        return "#000000";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.main, small && { width: sizer.moderateScale(273) }]}
      activeOpacity={baseOpacity}
      onPress={handlePress}
    >
      {data?.type == "campaign" && (
        <>
          <Flex
            flexStyle={{
              ...styles.floatBtn,
            }}
            algItems="center"
            gap={small ? 2 : 4}
          >
            <Typography
              text={data?.voltzPerHour}
              color={COLORS.primary}
              semiBold
              size={small ? 14 : 16}
            />
            {small ? <VoltzIconSmallV2 /> : <VoltzIconSmall />}
          </Flex>

          <Flex
            flexStyle={{
              height: sizer.moderateVerticalScale(30),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              position: "absolute",
              zIndex: 1000,
              top: sizer.moderateVerticalScale(8),
              right: sizer.moderateScale(10),
              backgroundColor: COLORS.white,
              paddingHorizontal: 10,
            }}
          >
            <Typography
              text={(campaignStatus?.status).toUpperCase()}
              color={campaignStatus.color}
              semiBold
              size={14}
            />
          </Flex>
        </>
      )}
      <Image
        source={{
          uri: data?.bannerImage ? data?.bannerImage : placeholder_cover_img,
        }}
        style={{
          width: "100%",
          height: sizer.moderateVerticalScale(140),
        }}
      />

      <View
        style={{
          paddingHorizontal: sizer.moderateScale(16),
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Fragment>
          <Flex
            gap={8}
            mt={small ? 10 : 12}
            algItems="center"
            jusContent={"space-between"}
          >
            <Flex
              gap={8}
              mt={small ? 10 : 12}
              algItems="center"
              flexStyle={{ width: data?.volunteerStatus ? "50%" : "100%" }}
            >
              <Image
                source={{
                  uri: data?.user?.profileImage || placeholder_cover_img,
                }}
                style={{
                  width: sizer.moderateScale(30),
                  height: sizer.moderateScale(30),
                  borderRadius: 5,
                }}
              />
              <Typography
                text={data?.user?.name}
                color={COLORS.text}
                size={small ? 12 : 14}
                numberOfLines={1}
                semiBold
              />
            </Flex>
            {data?.volunteerStatus && (
              <Flex
                flexStyle={{
                  height: sizer.moderateVerticalScale(30),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                  zIndex: 1000,
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 10,
                }}
              >
                <Typography
                  text={data?.volunteerStatus?.toUpperCase()}
                  color={getStatusColor(data?.volunteerStatus)}
                  semiBold
                  size={10}
                />
              </Flex>
            )}
          </Flex>
          <Typography
            text={`${data?.title}`}
            color={COLORS.blackV1}
            bold
            size={small ? 16 : 18}
            mT={small ? 10 : 14}
            numberOfLines={1}
          />
          <Typography
            text={`${data?.description}`}
            color={COLORS.text}
            size={small ? 12 : 14}
            mT={small ? 4 : 6}
            numberOfLines={1}
          />

          <DonationAvatarGroup small={small} data={data} />

          {data?.donationRequired && (
            <ProgressBar
              progress={calculateDonationPercentage(
                data?.donationReceived || 0,
                data?.donationRequired || 0
              )}
              style={{
                marginTop: sizer.moderateVerticalScale(small ? 5 : 14),
                height: sizer.moderateVerticalScale(small ? 2 : 3),
                borderRadius: 10,
              }}
              color={COLORS.secondary}
            />
          )}
        </Fragment>
        <Flex gap={4}>
          {data?.type == "charity" ||
            (!register && (
              <OutlineButton
                label={"Register"}
                isLoading={isLoading}
                onPress={() => handleFollow(data?.id, "register")}
                labelSize={12}
                style={styles.buttons}
                disabled={
                  campaignStatus?.status == "Expired" ||
                  data?.volunteerRequired == data?.totalVolunteerRegistered
                }
                smallBtn={small}
              />
            ))}
          <OutlineButton
            onPress={() => {
              checkLoginStatus() && setVisible(true);
            }}
            labelSize={12}
            label="Donate"
            style={styles.buttons}
            disabled={
              campaignStatus?.status == "Expired" ||
              (data?.donationRequired
                ? data?.donationReceived >= data?.donationRequired
                : false)
            }
            smallBtn={small}
          />
        </Flex>
      </View>
      <DonationModal
        isVisible={isVisible}
        setVisible={setVisible}
        setCardModal={setCardModal}
        setPaymentApiUrl={setPaymentApiUrl}
        data={data}
      />
      <CardDetailModal
        isVisible={cardModal}
        setVisible={setCardModal}
        paymentApiUrl={paymentApiUrl}
        setDonationSuccess={setDonationSuccess}
      />
    </TouchableOpacity>
  );
};

export default SuggestedCharityCard;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.whiteV1,
    marginTop: sizer.moderateVerticalScale(16),
    borderRadius: 16,
    overflow: "hidden",
    width: sizer.moderateScale(300),
  },
  floatBtn: {
    height: sizer.moderateVerticalScale(30),
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    zIndex: 1000,
    top: sizer.moderateVerticalScale(8),
    left: sizer.moderateScale(10),
    backgroundColor: "#F2F2F7CC",
    paddingHorizontal: 10,
  },
  buttons: {
    marginTop: sizer.moderateVerticalScale(13),
    marginBottom: sizer.moderateVerticalScale(13),
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
