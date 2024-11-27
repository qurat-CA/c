import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Container, Flex, Typography } from "../../atom-components";
import {
  CardDetailModal,
  DonationModal,
  Header,
  HorizontalScrollviewSpacing,
  LikeAndShare,
  OutlineButton,
  ProfileHeader,
  SuggestedCharityCard,
} from "../../components";
import {
  EmptyCampaign,
  ProfileCalendarIcon,
  ProfileLoactionIcon,
} from "../../assets";
import { baseOpacity, COLORS, placeholder_cover_img } from "../../globals";
import CharityGroupedAvatar from "../campaign-profile/shared/charity-avatr";
import { ProgressBar } from "react-native-paper";
import { sizer } from "../../helpers";
import { ViewAll } from "../today/shared";
import { useCheckLoginStatus, useFetchEventsData } from "../../hooks";
import { calculateDonationPercentage, onShareLink } from "../../utils";
import moment from "moment";
import format from "pretty-format";

const CharityProfile = ({ route, navigation }) => {
  const { id } = route.params;
  const [isVisible, setVisible] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [paymentApiUrl, setPaymentApiUrl] = useState("");
  const { checkLoginStatus } = useCheckLoginStatus();
  const { eventsData: charityData, refetch: refetchCharityData } =
    useFetchEventsData({
      shouldFetch: true,
      id: id,
      loader: true,
      loaderBackgroundWhite: true,
    });
  const { eventsData: SuggestedCharityData, refetch: SuggestedCharity } =
    useFetchEventsData({
      shouldFetch: true,
      query: "page=1&perPage=6&excludeExpired=true",
      type: "charity",
      byInterest: true,
      loaderBackgroundWhite: true,
    });

  useEffect(() => {
    if (donationSuccess) {
      refetchCharityData();
      SuggestedCharity();
      setDonationSuccess(false);
    }
  }, [donationSuccess]);
  return (
    <>
      <Header back pH={16} />
      <ScrollView>
        <Container>
          <ProfileHeader
            coverImg={{
              uri: charityData?.bannerImage || placeholder_cover_img,
            }}
          >
            <Typography text="Charity" mT={14} size={11} color="#27272E99" />
            <Typography
              text={charityData?.title}
              size={24}
              bold
              color="#3C3F43"
            />

            <Flex mt={6} gap={2} flexStyle={{ width: "100%" }}>
              <ProfileCalendarIcon />
              <Typography
                text={`${moment(charityData?.startDate).format(
                  "MMMM D, YYYY"
                )} | ${moment(charityData?.startDate).format(
                  "HH:mm"
                )} – ${moment(charityData?.endDate).format("HH:mm")}`}
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
                text={` location ${charityData?.country}, ${charityData?.city}, ${charityData?.state}`}
                size={12}
                color={COLORS.blackV2}
                numberOfLines={2}
              />
            </Flex>

            <Flex mt={8} algItems="center" gap={8} flexWrap={"wrap"}>
              {charityData?.sdgs?.map((item, i) => {
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
            </Flex>
            <Flex algItems={"center"} jusContent={"space-between"}>
              <TouchableOpacity
                activeOpacity={baseOpacity}
                onPress={() => {
                  navigation.navigate("NGOProfile", {
                    id: charityData?.userId,
                  });
                }}
              >
                <Flex algItems="center" gap={8} mt={8} flexStyle={{width: "80%"}}>
                  <Image
                    source={{
                      uri:
                        charityData?.user?.profileImage ||
                        placeholder_cover_img,
                    }}
                    style={{
                      width: sizer.moderateScale(33),
                      height: sizer.moderateVerticalScale(33),
                      borderRadius: 50,
                    }}
                  />
                  <Typography text={charityData?.user?.name} bold size={11} numberOfLines={2} />
                </Flex>
              </TouchableOpacity>
              <LikeAndShare
                sharePress={() =>
                  onShareLink({
                    page: "charity",
                    id: id,
                    message: "Check out this charity in voltz",
                  })
                }
              />
            </Flex>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate("ViewAllVolunteers", {
                  eventId: charityData?.id,
                  type: "donation",
                })
              }
            >
              <Flex algItems="center" mt={17} jusContent="space-between">
                <Flex algItems="center">
                  <Typography
                    text={"$" + charityData?.donationReceived + " raised"}
                    color="#969696"
                    semiBold
                  />
                  {charityData?.donationRequired && (
                    <Typography
                      text={` of $${charityData?.donationRequired} target`}
                      color="#969696"
                      size={11}
                      medium
                    />
                  )}
                </Flex>
                <CharityGroupedAvatar data={charityData} />
              </Flex>
            </TouchableOpacity>

            {charityData?.donationRequired && (
              <ProgressBar
                color={COLORS.secondary}
                progress={calculateDonationPercentage(
                  charityData?.donationReceived || 0,
                  charityData?.donationRequired || 0
                )}
                style={{
                  marginTop: sizer.moderateVerticalScale(8),
                  height: sizer.moderateVerticalScale(8),
                  borderRadius: 53,
                }}
              />
            )}

            <Flex gap={8} flexStyle={{ flex: 1 }}>
              <OutlineButton
                onPress={() => checkLoginStatus() && setVisible(true)}
                style={{ height: sizer.moderateVerticalScale(32) }}
                label="Donate"
              />
            </Flex>

            <Typography
              size={12}
              LineHeight={18}
              mT={14}
              text={charityData?.description}
            />
          </ProfileHeader>

          <ViewAll
            label="You may also like"
            fontBold
            showViewAll={SuggestedCharityData?.items?.length > 1 ? true : false}
            onPress={() => {
              navigation.navigate("ViewAllCharity");
            }}
          />

          <HorizontalScrollviewSpacing>
            <Flex gap={8} mb={8}>
              {SuggestedCharityData?.items
                ?.filter((charityObj) => charityObj?.id != id)
                .map((obj, i) => (
                  <SuggestedCharityCard
                    data={obj}
                    key={i}
                    handlePress={() => {
                      navigation.push("CharityProfile", { id: obj?.id });
                    }}
                  />
                ))}
            </Flex>
          </HorizontalScrollviewSpacing>
          {SuggestedCharityData?.items?.length == 1 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmptyCampaign width={sizer.moderateScale(200)} />
              <Typography textAlign="center" mB={10} bold>
                No Suggested Charities Found
              </Typography>
            </View>
          )}
        </Container>
        <DonationModal
          isVisible={isVisible}
          setVisible={setVisible}
          setCardModal={setCardModal}
          setPaymentApiUrl={setPaymentApiUrl}
          data={charityData}
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

export default CharityProfile;

const styles = StyleSheet.create({});
