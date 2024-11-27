import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { styles } from "./styles";
import { Typography } from "../../atom-components";
import { COLORS, CONSTANTS, baseOpacity } from "../../globals";
import { sizer } from "../../helpers";

const TAB_WIDTH = [75, 80, 80, 100, 100, 120];

const ReanimatedTabs = ({ TABS }) => {
  const [contentHeights, setContentHeights] = useState([]);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const { width } = useWindowDimensions();

  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
      width: TAB_WIDTH[activeTab],
    };
  });

  const tabRef = useRef();
  const swiperRef = useRef();

  const isTrustedRef = useRef(false);

  const scrollTab = (index) => {
    const totalWidth = TAB_WIDTH.slice(0, index).reduce(
      (acc, width) => acc + width,
      0
    );
    tabRef?.current?.scrollTo({
      x: totalWidth,
      animated: true,
    });
    offset.value = withTiming(totalWidth);
  };

  const scrollSwiper = (index) => {
    swiperRef?.current?.scrollTo({ x: index * width, animated: true });
  };

  const onTabPress = (index) => {
    scrollSwiper(index);
    scrollTab(index);
    setActiveTab(index);
    setScrollViewHeight(contentHeights[index]);
  };

  const handleScroll = (event) => {
    if (isTrustedRef.current) {
      const offstetX =
        event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width;
      const index = offstetX;
      const roundedIndex = Math.round(index);
      scrollTab(roundedIndex);
      setActiveTab(roundedIndex);
      setScrollViewHeight(contentHeights[roundedIndex]);
    }
  };

  const handleContentLayout = (index, event) => {
    const { height } = event.nativeEvent.layout;
    const newHeights = [...contentHeights];
    newHeights[index] = height;
    setContentHeights(newHeights);
  };

  const heightExist = contentHeights[0];
  const flag = useRef(true);
  useEffect(() => {
    if (!!heightExist && flag) {
      setScrollViewHeight(heightExist);
      flag.current = false;
    }
  }, [heightExist]);

  return (
    <>
      {/* Animated Tab bar section  */}
      <ScrollView
        ref={tabRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
      >
        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            {TABS.map((tab, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={baseOpacity}
                  onPress={() => onTabPress(i)}
                  style={[styles.tab, { width: TAB_WIDTH[i] }]}
                >
                  <Typography
                    textAlign="center"
                    text={tab.label}
                    color={activeTab == i ? COLORS.secondary : COLORS.black}
                    bold={activeTab == i}
                    mB={5}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Animated.View style={[styles.animatedView, animatedStyles]} />
        </View>
      </ScrollView>

      {/* Swiper Section  */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        ref={swiperRef}
        horizontal
        onScrollBeginDrag={() => {
          isTrustedRef.current = true;
        }}
        onScrollEndDrag={() => {
          setTimeout(() => {
            isTrustedRef.current = false;
          }, 150);
        }}
        pagingEnabled
        scrollEnabled={false}
        onScroll={handleScroll}
        nestedScrollEnabled
        style={{ height: scrollViewHeight, flex:1 }}
      >
        {TABS.map((tab, i) => (
          <ScrollView key={i} showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: width,
                paddingHorizontal: sizer.moderateScale(
                  i == 5 ? 0 : CONSTANTS.containerPaddingX
                ),
              }}
              onLayout={(event) => handleContentLayout(i, event)}
            >
              {tab.Component({ activeTab: activeTab })}
            </View>
          </ScrollView>
        ))}
      </ScrollView>
    </>
  );
};

export default ReanimatedTabs;
