import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Container, Flex, Typography } from "../../atom-components";
import {
  baseOpacity,
  COLORS,
  CONSTANTS,
  placeholder_cover_img,
} from "../../globals";
import {
  CampaignProfileBottomSheet,
  CardDetailModal,
  DonationModal,
  Header,
  HorizontalScrollviewSpacing,
  LikeAndShare,
  OutlineButton,
  ProfileHeader,
  SuggestedCharityCard,
} from "../../components";
import { sizer } from "../../helpers";
import {
  DealPointIcon,
  EmptyCampaign,
  ProfileCalendarIcon,
  ProfileLoactionIcon,
  VerticalEllipsis,
} from "../../assets";
import { ProgressBar } from "react-native-paper";
import { ViewAll } from "../today/shared";
import CharityGroupedAvatar from "./shared/charity-avatr";

import {
  useCheckLoginStatus,
  useFetchEventsData,
  useRegisterUnRegister,
} from "../../hooks";
import {
  calculateDonationPercentage,
  formatNumber,
  onShareLink,
} from "../../utils";
import moment from "moment";
import format from "pretty-format";
import CampaignStatus from "../../atom-components/campaign-status";
import { openToast } from "../../store/reducer";
import { useDispatch } from "react-redux";

const CampaignProfile = ({ route, navigation }) => {
  const { id } = route.params;
  const [isVisible, setVisible] = useState(false);
  const [donationModal, setDonationModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [paymentApiUrl, setPaymentApiUrl] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);

  const dispatch = useDispatch();
  const { registerUnRegister, isLoading } = useRegisterUnRegister();
  const {
    eventsData: campaignData,
    setEventsData: setCampaignData,
    refetch: refetchCampaignData,
  } = useFetchEventsData({
    shouldFetch: true,
    id: id,
    loader: true,
    loaderBackgroundWhite: true,
  });
  const campaignStatus = CampaignStatus(campaignData);
  const { checkLoginStatus } = useCheckLoginStatus();
  const { eventsData: SuggestedCampaignData, refetch: SuggestedCampaign } =
    useFetchEventsData({
      shouldFetch: true,
      query:
        "page=1&perPage=6&excludeExpired=true&exceedAlreadyRegistered=false",
      type: "campaign",
      byInterest: true,
      loaderBackgroundWhite: true,
    });

  const handleRegister = async (id, action) => {
    if (checkLoginStatus()) {
      const success = await registerUnRegister(id, action);
      if (success) {
        const updatedCampaignData = {
          ...campaignData,
          registered: action === "register",
        };
        setCampaignData(updatedCampaignData);
      }
    }
  };

  useEffect(() => {
    if (donationSuccess) {
      refetchCampaignData();
      SuggestedCampaign();
      setDonationSuccess(false);
    }
  }, [donationSuccess]);

  return (
    <>
      <Header back pH={16} />
      <ScrollView>
        <Container bgColor={COLORS.whiteV2}>
          <ProfileHeader
            coverImg={{
              uri: campaignData?.bannerImage || placeholder_cover_img,
            }}
          >
            <Typography text="Campaign" mT={14} size={11} color="#27272E99" />
            <Typography
              text={campaignData.title}
              size={24}
              bold
              color="#3C3F43"
            />
            <Typography color={campaignStatus?.color} bold>
              {campaignStatus?.status.toUpperCase()}
            </Typography>

            <Flex algItems="center" jusContent="space-between">
              <View style={{ width: "80%" }}>
                <Flex
                  mt={6}
                  gap={2}
                  flexStyle={{ width: "100%" }}
                  algItems={"center"}
                >
                  <ProfileCalendarIcon />
                  <Typography
                    text={`${moment(campaignData?.startDate).format(
                      "MMMM D, YYYY"
                    )} | ${moment(campaignData?.startDate).format(
                      "HH:mm"
                    )} – ${moment(campaignData?.endDate).format("HH:mm")}`}
                    size={12}
                    color={COLORS.blackV2}
                  />
                </Flex>

                <Flex
                  mt={6}
                  gap={2}
                  flexStyle={{ width: "100%" }}
                  algItems={"center"}
                >
                  <ProfileLoactionIcon />
                  <Typography
                    text={`${campaignData?.country}, ${campaignData?.city}, ${campaignData?.state}`}
                    size={12}
                    color={COLORS.blackV2}
                    numberOfLines={2}
                  />
                </Flex>
              </View>
              <LikeAndShare
                sharePress={() =>
                  onShareLink({
                    page: "campaign",
                    id: id,
                    message: "Check out this campaign in voltz",
                  })
                }
              />
            </Flex>

            <Flex mt={8} algItems="center" gap={8} flexWrap={"wrap"}>
              {campaignData?.sdg?.map((item, i) => {
                return (
                  <Image
                    key={i}
                    source={{ uri: item?.image }}
                    style={{
                      width: sizer.moderateScale(33),
                      height: sizer.moderateVerticalScale(33),
                      borderRadius: 5,
                    }}
                  />
                );
              })}
              <Flex algItems="center">
                <Typography
                  text={campaignData?.voltzPerHour}
                  bold
                  color={COLORS.primary}
                />
                <DealPointIcon />
              </Flex>
            </Flex>

            <TouchableOpacity
              activeOpacity={baseOpacity}
              onPress={() => {
                navigation.navigate("NGOProfile", {
                  id: campaignData?.userId,
                });
              }}
            >
              <Flex algItems="center" gap={8} mt={8}>
                <Image
                  source={{
                    uri:
                      campaignData?.user?.profileImage || placeholder_cover_img,
                  }}
                  style={{
                    width: sizer.moderateScale(33),
                    height: sizer.moderateVerticalScale(33),
                    borderRadius: 50,
                  }}
                />
                <Typography text={campaignData?.user?.name} bold size={11} />
              </Flex>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate("ViewAllVolunteers", {
                  eventId: campaignData?.id,
                  type: "donation",
                })
              }
            >
              <Flex algItems="center" mt={17} jusContent="space-between">
                <Flex algItems="center">
                  <Typography
                    text={
                      "$" +
                      formatNumber(campaignData?.donationReceived) +
                      " raised"
                    }
                    color="#969696"
                    semiBold
                  />
                  {campaignData?.donationRequired && (
                    <Typography
                      text={` of $${formatNumber(
                        campaignData?.donationRequired
                      )} target`}
                      color="#969696"
                      size={11}
                      medium
                    />
                  )}
                </Flex>
                <CharityGroupedAvatar data={campaignData} />
              </Flex>
            </TouchableOpacity>

            {campaignData?.donationRequired && (
              <ProgressBar
                progress={calculateDonationPercentage(
                  campaignData?.donationReceived || 0,
                  campaignData?.donationRequired || 0
                )}
                color={COLORS.secondary}
                style={{
                  marginTop: sizer.moderateVerticalScale(8),
                  height: sizer.moderateVerticalScale(8),
                  borderRadius: 53,
                }}
              />
            )}

            <Flex gap={8} flexStyle={{ flex: 1 }}>
              <Flex gap={8} flexStyle={{ flex: 1 }}>
                {!campaignData?.registered && (
                  <OutlineButton
                    style={{ height: sizer.moderateVerticalScale(31) }}
                    label={"Register"}
                    isLoading={isLoading}
                    disabled={
                      campaignStatus?.status == "Expired" ||
                      campaignData?.volunteerRequired ==
                        campaignData?.totalVolunteerRegistered
                    }
                    onPress={() => {
                      handleRegister(campaignData?.id, "register");
                    }}
                  />
                )}
                <OutlineButton
                  onPress={() => checkLoginStatus() && setDonationModal(true)}
                  style={{ height: sizer.moderateVerticalScale(31) }}
                  label="Donate"
                  disabled={
                    campaignStatus?.status == "Expired" ||
                    (campaignData?.donationRequired
                      ? campaignData?.donationReceived >=
                        campaignData?.donationRequired
                      : false)
                  }
                />
              </Flex>
              {campaignData?.registered && (
                <Flex flexStyle={{ flex: 0.12 }}>
                  <OutlineButton
                    style={{ height: sizer.moderateVerticalScale(31) }}
                    label={<VerticalEllipsis />}
                    onPress={() => setVisible(true)}
                  />
                </Flex>
              )}
            </Flex>

            <Typography
              size={12}
              LineHeight={18}
              mT={14}
              text={campaignData?.description}
            />
          </ProfileHeader>

          {SuggestedCampaignData?.items?.length > 1 && (
            <ViewAll
              label="You may also like"
              fontBold
              showViewAll={
                SuggestedCampaignData?.items?.length > 1 ? true : false
              }
              onPress={() => {
                navigation.navigate("ViewAllCampaigns");
              }}
            />
          )}
          <HorizontalScrollviewSpacing>
            <Flex gap={8} mb={8}>
              {SuggestedCampaignData?.items
                ?.filter((campaignObj) => campaignObj?.id != id)
                .map((obj, i) => (
                  <SuggestedCharityCard
                    data={obj}
                    key={i}
                    handlePress={() => {
                      navigation.push("CampaignProfile", { id: obj?.id });
                    }}
                  />
                ))}
            </Flex>
          </HorizontalScrollviewSpacing>
          {SuggestedCampaignData?.items?.length == 1 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmptyCampaign width={sizer.moderateScale(200)} />
              <Typography textAlign="center" mT={-30} mB={10} bold>
                No Suggested Campaign Found
              </Typography>
            </View>
          )}
          <CampaignProfileBottomSheet
            isVisible={isVisible}
            setVisible={setVisible}
            leaveEvent={() => {
              if (
                campaignStatus?.status == "Ongoing" &&
                campaignStatus?.status == "Expired"
              ) {
                dispatch(
                  openToast({
                    message:
                      "You can't leave campaign Because it's " +
                      campaignStatus.status,
                  })
                );
                return;
              }
              handleRegister(campaignData?.id, "un-register");
            }}
            navigateLogMyHour={() =>
              navigation.navigate("LogMyHours", { eventId: campaignData?.id })
            }
            campaignStatus={campaignStatus}
          />
        </Container>
        <DonationModal
          isVisible={donationModal}
          setVisible={setDonationModal}
          setCardModal={setCardModal}
          setPaymentApiUrl={setPaymentApiUrl}
          data={campaignData}
        />
        <CardDetailModal
          isVisible={cardModal}
          setVisible={setCardModal}
          paymentApiUrl={paymentApiUrl}
          setDonationSuccess={setDonationSuccess}
        />
      </ScrollView>
    </>
  );
};

export default CampaignProfile;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginHorizontal: -CONSTANTS.containerPaddingX,
    height: sizer.moderateVerticalScale(567),
    marginTop: sizer.moderateVerticalScale(16),
    borderBottomLeftRadius: sizer.moderateScale(16),
    borderBottomRightRadius: sizer.moderateScale(16),
    overflow: "hidden",
  },
  coverImg: { height: 158, width: "100%" },
  profileImg: {
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: sizer.moderateVerticalScale(76),
    left: sizer.moderateScale(16),
  },
});
