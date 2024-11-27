import { View, ScrollView, StyleSheet } from "react-native";

import { EmptyState, Flex, Typography } from "../../../atom-components";
import { COLORS } from "../../../globals";
import { sizer } from "../../../helpers";
import { CustomBarChart, CustomDropdown } from "../../index";
import { History, MyVoltz } from "./data";
import MyVoltzCard from "./my-voltz-card";
import RenderItem from "./renderItem";
import ApiManager from "../../../helpers/api-manager";
import { useDispatch } from "react-redux";
import { openToast } from "../../../store/reducer";
import { useEffect, useState } from "react";
import format from "pretty-format";
import {
  VoltzIconSmall,
  VoltzIconSmallBlack,
  VoltzIconSmallYellow,
} from "../../../assets";

const About = ({ isMyProfile, profileData = {}, userId, activeTab }) => {
  const [targetAchievement, setTargetAchievement] = useState([]);
  const [voltzHistory, setVoltzHistory] = useState([]);
  const [voltzHistoryFilter, setVoltzHistoryFilter] = useState("");

  const dispatch = useDispatch();

  const handleGetTargetAchievement = async () => {
    try {
      const { data } = await ApiManager(
        "get",
        `goal/yearly-target?userId=${userId}`
      );
      setTargetAchievement(data?.response?.details);
    } catch (error) {
      dispatch(openToast({ message: error?.response?.data?.message }));
    }
  };

  const handleGetVoltzHistory = async (status = "") => {
    try {
      const { data } = await ApiManager(
        "get",
        `users/voltzHistoryStats${status && "?status=" + status}`
      );
      setVoltzHistory(data?.response?.details);
    } catch (error) {
      dispatch(openToast({ message: error?.response?.data?.message }));
    }
  };

  const voltzItems = [
    {
      label: "Earned",
      value: voltzHistory?.voltz?.earned,
      Icon: <VoltzIconSmall />,
    },
    {
      label: "Spent",
      value: voltzHistory?.voltz?.spent,
      Icon: <VoltzIconSmallBlack />,
    },
    {
      label: "Available",
      value: voltzHistory?.voltz?.available,
      Icon: <VoltzIconSmallYellow />,
    },
  ];

  useEffect(() => {
    if (activeTab == 0) {
      handleGetTargetAchievement();
      handleGetVoltzHistory();
    }
  }, [activeTab]);

  return (
    <View style={styles.main}>
      {profileData?.about && (
        <>
          <Typography text="About" {...styles.bioTitle} />
          <Typography text={profileData?.about} {...styles.bioDesc} />
        </>
      )}
      <Typography
        text="Target Achievement"
        semiBold
        size={18}
        color={COLORS.blackV1}
        mT={24}
        mB={16}
      />
      <CustomBarChart targetAchievement={targetAchievement} />

      {isMyProfile && (
        <View>
          <Typography
            text="My Voltz"
            semiBold
            size={18}
            color={COLORS.blackV1}
            mT={24}
          />

          <Flex gap={sizer.moderateScale(8)}>
            {voltzItems.map((item, index) => (
              <MyVoltzCard key={index} item={item} />
            ))}
          </Flex>

          <Flex jusContent="space-between" mt={24} algItems="center">
            <Typography
              text="History"
              semiBold
              size={18}
              color={COLORS.blackV1}
            />
            <View style={{ width: 150 }}>
              <CustomDropdown
                style={styles.dropdown}
                height={40}
                value={voltzHistoryFilter?.id}
                selectedValue={(data) => {
                  setVoltzHistoryFilter(data), handleGetVoltzHistory(data?.id);
                }}
                Data={[
                  { label: "All", id: "" },
                  { label: "Earned", id: "earned" },
                  { label: "Spent", id: "spent" },
                ]}
                placeholder="Select"
              />
            </View>
          </Flex>
          <ScrollView style={{ marginTop: sizer.moderateVerticalScale(24) }}>
            {(voltzHistory?.history || []).map((item, i) => {
              return <RenderItem item={item} key={i} />
            })}
            {!(voltzHistory?.history || [])?.length && (
              <EmptyState message={"No history found"}  />
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  main: {
    marginTop: sizer.moderateVerticalScale(24),
  },
  dropdown: {
    width: sizer.moderateScale(80),
    backgroundColor: COLORS.white,
  },
  bioTitle: { semiBold: true, size: 18, color: COLORS.blackV1 },
  bioDesc: {
    size: 12,
    color: COLORS.text,
    mT: 16,
    LineHeight: 18,
  },
});
