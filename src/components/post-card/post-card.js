import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { sizer } from "../../helpers";
import { Flex, Typography } from "../../atom-components";
import { baseOpacity, COLORS, placeholder_profile_img } from "../../globals";
import moment from "moment";
import Icon from "react-native-vector-icons/Entypo";
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCheckLoginStatus } from "../../hooks";
import MessageField from "../custom-fields/message-field";
import ApiManager from "../../helpers/api-manager";
import { openToast } from "../../store/reducer";
import { useDispatch } from "react-redux";
import format from "pretty-format";
import EllipsisMenu from "../ellipsis-menu";

const PostCard = ({
  data = {},
  onMenuPress = () => {},
  me = {},
  onLikePress = () => {},
  communityData = {},
  navigation,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentSendLoader, setCommentSendLoader] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [allCommentsData, setAllCommentsData] = useState([]);

  const dispatch = useDispatch();
  const { checkLoginStatus } = useCheckLoginStatus();

  const handleLikePress = () => {
    if (checkLoginStatus()) {
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount((prevCount) =>
        newLikeStatus ? prevCount + 1 : prevCount - 1
      );

      onLikePress(data?.id, newLikeStatus);
    }
  };

  const toggleContentDisplay = () => {
    setShowFullContent((prev) => !prev);
  };

  const renderMenuIcon = (postAuthorId, communityCreatorId, userId) => {
    if (
      (userId === postAuthorId || userId === communityCreatorId) &&
      checkLoginStatus()
    ) {
      return (
        <TouchableOpacity onPress={onMenuPress}>
          <Icon
            name={"dots-three-vertical"}
            size={sizer.fontScale(13)}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderPostContent = () => {
    const maxLength = 160;
    if (data?.content?.length > maxLength) {
      return (
        <>
          <Typography style={styles.postText} size={14}>
            {showFullContent
              ? data?.content
              : `${data?.content.slice(0, maxLength)}...`}
          </Typography>
          <TouchableOpacity onPress={toggleContentDisplay}>
            <Typography
              style={styles.readMore}
              size={14}
              color={COLORS.primary}
              bold
            >
              {showFullContent ? "Show less" : "Read more"}
            </Typography>
          </TouchableOpacity>
        </>
      );
    }
    return (
      <Typography style={styles.postText} size={14}>
        {data?.content}
      </Typography>
    );
  };

  const handleNavigateVolunteerProfile = () => {
    if (checkLoginStatus() && data?.author?.role == "volunteer") {
      navigation.navigate("VolunteerProfile", {
        id: data?.author?.id,
      });
    }
  };

  const handleCommentSend = async () => {
    setCommentSendLoader(true);
    const formData = {
      content: commentText,
      postId: data?.id,
    };

    try {
      const { data } = await ApiManager("post", "comments", formData);
      setAllCommentsData((prev) => [data?.response?.details, ...prev]);
    } catch (error) {
      dispatch(openToast({ message: error?.response?.data?.message }));
    } finally {
      setCommentSendLoader(false);
    }
  };

  const getAllComments = async () => {
    const postId = Number(data?.id);
    try {
      const { data } = await ApiManager(
        "get",
        `comments?postId=${postId}&page=${page}&perPage=${perPage}`
      );
      setAllCommentsData(data?.response);
    } catch (error) {
      dispatch(openToast({ message: error?.response?.data?.message }));
    } finally {
    }
  };

  const handleLoadmoreComments = () => {
    if (
      allCommentsData?.details.length >= perPage &&
      allCommentsData?.totalPages !== page
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleCommentShow = () => {
    setShowComments((prev) => !prev);
  };

  useEffect(() => {
    setLikeCount(data?.likesCount);
    setIsLiked(data?.isLiked);
  }, [data]);

  useEffect(() => {
    getAllComments();
  }, [page]);

  useEffect(() => {
    setAllCommentsData([...allCommentsData, ...(allCommentsData?.details || [])]);
  }, [allCommentsData]);

  useEffect(() => {
    if (showComments) {
      const gettingComments = async () => {
        await getAllComments();
      };
      gettingComments();
    }
  }, [showComments]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={baseOpacity}
          onPress={handleNavigateVolunteerProfile}
          style={styles.userInfo}
        >
          <Image
            source={{ uri: data?.userImage || placeholder_profile_img }}
            style={styles.userImage}
          />
          <View style={styles.userDetails}>
            <Typography style={styles.userName} numberOfLines={2}>
              {data?.author?.name}
            </Typography>
            <Flex algItems={"center"} gap={10}>
              <Typography style={styles.createdAt}>
                {moment(data?.createdAt).fromNow()}
              </Typography>
              {data?.pinned && (
                <>
                  <Icon
                    name={"pin"}
                    size={sizer.fontScale(13)}
                    color={"#757575"}
                  />
                  <Typography size={12} color={"#757575"} mL={-5}>
                    Pinned
                  </Typography>
                </>
              )}
            </Flex>
          </View>
        </TouchableOpacity>
        {renderMenuIcon(
          data?.author?.id,
          communityData?.createdBy?.id,
          me?.details?.id
        )}
      </View>
      {renderPostContent()}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <AntIcon
            name={isLiked ? "heart" : "hearto"}
            size={sizer.moderateScale(20)}
            color={isLiked ? COLORS.dangerV1 : "#757575"}
          />
          <Typography style={styles.likeCount} size={14}>
            {likeCount}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleCommentShow}
          activeOpacity={baseOpacity}
          style={styles.likeButton}
        >
          <MaterialIcons
            name={"comment"}
            size={sizer.moderateScale(20)}
            color={"#757575"}
          />
          {/* <Typography style={styles.likeCount} size={14}>
            {likeCount}
          </Typography> */}
        </TouchableOpacity>
      </View>

      {showComments && (
        <>
          <Typography size={14} mT={10} bold>
            Comments
          </Typography>

          <MessageField
            comment
            placeholder="Enter comment here"
            messageText={commentText}
            setMessageText={setCommentText}
            messageSendHandler={handleCommentSend}
            sendLoading={commentSendLoader}
          />

          <FlatList
            data={allCommentsData?.details || []}
            renderItem={({ item }) => {
              return (
                <Flex jusContent="space-between" mt={15}>
                  <Flex algItems="center" gap={6}>
                    <Image
                      source={{
                        uri:
                          item?.commenter?.profileImage ||
                          placeholder_profile_img,
                      }}
                      style={styles.userImage}
                    />
                    <View>
                      <Typography size={14} semiBold>
                        {item?.commenter?.firstName +
                          " " +
                          item?.commenter?.lastName}
                      </Typography>

                      <Typography size={12}>{item?.content}</Typography>
                    </View>
                  </Flex>

                  {(item?.commenter?.id === me?.details?.id ||
                    communityData?.createdBy?.id === me?.details?.id) &&
                    checkLoginStatus() && (
                      <TouchableOpacity>
                        <Icon
                          name={"dots-three-vertical"}
                          size={sizer.fontScale(13)}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    )}

                  {/* <EllipsisMenu /> */}
                </Flex>
              );
            }}
          />

          <TouchableOpacity
            activeOpacity={baseOpacity}
            onPress={handleLoadmoreComments}
          >
            <Typography
              size={14}
              textAlign="center"
              color={COLORS.primary}
              semiBold
              mT={10}
            >
              View more Comments
            </Typography>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: sizer.moderateScale(10),
    padding: sizer.moderateScale(15),
    marginBottom: sizer.moderateVerticalScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: sizer.moderateScale(5),
    // elevation: ,
    marginHorizontal: sizer.moderateScale(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: sizer.moderateScale(40),
    height: sizer.moderateScale(40),
    borderRadius: sizer.moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userDetails: {
    paddingHorizontal: sizer.moderateScale(8),
    maxWidth: "90%",
  },
  userName: {
    fontSize: sizer.moderateScale(16),
    fontWeight: "bold",
    color: COLORS.primary,
  },
  createdAt: {
    fontSize: sizer.moderateScale(12),
    color: "#757575",
  },
  postText: {
    marginTop: sizer.moderateVerticalScale(10),
    color: "#333333",
    lineHeight: sizer.moderateScale(20),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: sizer.moderateVerticalScale(10),
    gap: 20,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: sizer.moderateScale(5),
    color: "#757575",
  },
});

export default PostCard;
