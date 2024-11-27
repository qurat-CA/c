import { Flex, Typography } from "../../atom-components";
import { COLORS } from "../../globals";
import {
  CalendarDate,
  DealPointIcon,
  EventsDark,
  ProfileChartIcon,
  UsersThreeDark,
} from "../../assets";
import format from "pretty-format";

const ProfileHeaderStatus = ({ profile, goalAchieved }) => {
  return (
    <Flex mt={16} jusContent="space-between" algItems="center">
      <Flex gap={3} algItems="center">
        <DealPointIcon />
        <Typography
          size={14}
          text={goalAchieved?.voltzEarned || 0}
          color={COLORS.blackV2}
        />
      </Flex>
      <Flex gap={3}>
        <CalendarDate />
        <Typography
          size={14}
          text={goalAchieved?.totalEventsParticipated || "0"}
          color={COLORS.blackV2}
        />
      </Flex>
      <Flex gap={3} algItems="center">
        <EventsDark />
        <Typography
          size={14}
          text={goalAchieved?.followersCount || "0"}
          color={COLORS.blackV2}
        />
      </Flex>
      <Flex gap={3} algItems="center">
        <UsersThreeDark />
        <Typography
          size={14}
          text={goalAchieved?.followingCount || "0"}
          color={COLORS.blackV2}
        />
      </Flex>
      <Flex gap={3} algItems="center">
        <ProfileChartIcon />
        <Typography
          size={14}
          text={goalAchieved?.sdgs?.length || 0}
          color={COLORS.blackV2}
        />
        <Typography size={14} text="| 17" color="#C6C6C6" bold />
      </Flex>
    </Flex>
  );
};

export default ProfileHeaderStatus;
