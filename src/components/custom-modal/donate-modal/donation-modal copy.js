import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";

import { Flex, Typography } from "../../../atom-components";
import { ModalWrapper, OutlineButton, DonationChip } from "../../index";
import { COLORS, baseOpacity } from "../../../globals";
import { fontFamily, sizer } from "../../../helpers";
import { openToast, toggleLoader } from "../../../store/reducer";
import ApiManager from "../../../helpers/api-manager";

const DonationModal = ({
  isVisible,
  setVisible = () => {},
  data = {},
  setCardModal = () => {},
  setPaymentApiUrl = () => {},
}) => {
  const [activeChip, setActiveChip] = useState(0);
  const [formErr, setFormErr] = useState("");
  const [amount, setAmount] = useState("$5");
  const dispatch = useDispatch();
  const donationRequired = data?.donationRequired
    ? data?.donationRequired - data?.donationReceived
    : 1000;

  const generateSuggestedAmounts = (donationRequired) => {
    const minAmount = 5;
    if (donationRequired < minAmount) {
      return [`$${donationRequired}`]; // Only one chip with the required amount
    }
    const maxAmount = Math.max(donationRequired, minAmount);
    const suggestedAmounts = Array.from({ length: 6 }, (_, i) => {
      return Math.round(minAmount + (maxAmount - minAmount) * (i / 5));
    });
    return suggestedAmounts.map((value) => `$${value}`);
  };

  const donationChips = generateSuggestedAmounts(donationRequired);

  useEffect(() => {
    if (donationChips.length === 1) {
      setAmount(donationChips[0]);
    } else {
      setAmount("$5");
    }
  }, [donationChips]);

  const handleCreateDonation = async (id) => {
    setVisible(false);
    dispatch(toggleLoader(true));
    try {
      let { data } = await ApiManager("post", `donation`, {
        amount: parseInt(amount.replace("$", ""), 10),
        eventId: id,
        redirectUrl: "app",
      });
      setPaymentApiUrl(data?.response?.details?.formUrl);
      setCardModal(true);
    } catch (error) {
      console.log("🚀 ~ handleCreateDonation ~ error:", error?.response?.data);
      dispatch(openToast({ message: error?.response?.data?.message }));
    } finally {
      dispatch(toggleLoader(false));
    }
  };

  useEffect(() => {
    if (!amount || amount === "$") {
      setActiveChip(-1);
    }
  }, [amount]);

  return (
    <ModalWrapper isVisible={isVisible} setVisible={setVisible}>
      <TouchableOpacity
        activeOpacity={baseOpacity}
        onPress={() => setVisible(false)}
      >
        <Icon
          name="cross"
          size={sizer.moderateScale(20)}
          color="#C4C4C4"
          style={{
            paddingTop: sizer.moderateVerticalScale(25),
            alignSelf: "flex-end",
          }}
        />
      </TouchableOpacity>
      <Flex gap={18}>
        <Image
          source={{ uri: data?.bannerImage }}
          style={{
            width: sizer.moderateScale(52),
            height: sizer.moderateScale(52),
            borderRadius: 6,
          }}
        />

        <View style={{ width: "80%" }}>
          <Typography
            text={data?.title}
            size={20}
            bold
            color="#27272E"
            numberOfLines={1}
          />
          <Typography
            text={data?.description}
            size={14}
            color="#7B7B80"
            numberOfLines={2}
          />
        </View>
      </Flex>

      <Typography text="Enter your donation" mT={30} size={18} semiBold />
      <Flex gap={11} flexWrap="wrap" mt={16} jusContent="space-between">
        {donationChips.map((dollar, i) => {
          return (
            <DonationChip
              activeChip={activeChip}
              setActiveChip={setActiveChip}
              i={i}
              key={i}
              dollars={dollar}
              setAmount={setAmount}
            />
          );
        })}
      </Flex>

      <TextInput
        placeholder="Custom Amount"
        value={amount && parseInt(amount?.replace("$", ""), 10).toString()}
        onChangeText={(text) => {
          if (text > donationRequired) {
            setFormErr(`The Required amount is $${donationRequired}`);
            return;
          } else {
            setFormErr("");
          }
          setAmount(text);
        }}
        style={{
          height: sizer.moderateVerticalScale(53),
          marginTop: sizer.moderateVerticalScale(10),
          borderRadius: 6,
          paddingHorizontal: sizer.moderateScale(9),
          borderColor: COLORS.greyV11,
          borderWidth: sizer.moderateScale(1.5),
          color: COLORS.black,
          paddingHorizontal: sizer.moderateScale(24),
        }}
        keyboardType="numeric"
        placeholderTextColor={COLORS.text}
      />
      {formErr && <Text style={styles.errorText}>{formErr}</Text>}
      <Typography text="Total" mT={30} size={18} semiBold />

      <Flex jusContent="space-between">
        <Typography text="Your Donation" size={18} color="#7B7B80" medium />
        <Typography
          text={amount && "$" + parseInt(amount?.replace("$", ""), 10)}
          size={18}
          color="#7B7B80"
          medium
        />
      </Flex>

      <Flex>
        <OutlineButton
          disabled={!amount}
          label="Donate Now"
          style={{
            marginTop: sizer.moderateVerticalScale(31),
            marginBottom: sizer.moderateVerticalScale(25),
          }}
          onPress={() => handleCreateDonation(data?.id)}
        />
      </Flex>
    </ModalWrapper>
  );
};

export default DonationModal;

const styles = StyleSheet.create({
  errorText: {
    fontSize: sizer.fontScale(12),
    color: COLORS.dangerV1,
    ...fontFamily.regular(),
    marginTop: sizer.moderateVerticalScale(4),
  },
});
