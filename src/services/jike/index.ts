import { defHttp } from '~/utils/http/axios'
import configState from '~/models/keyValue/configState'
import ModuleState from '~/models/keyValue/moduleState'

class Jike {
  private module = 'jike'

  /**
   * 请求主页，保持登录或刷新登录
   */
  async mainPage() {
    const { site } = await configState.getItem(this.module)
    await defHttp.get({ url: site })
  }

  /**
   * 个人信息
   */
  async moduleInfo(refresh = false) {
    if (!refresh) {
      const cache = await ModuleState.getValidItem(this.module)
      if (cache)
        return cache
    }

    await this.mainPage()

    const { apiUrl } = await configState.getItem(this.module)

    try {
      const res = await defHttp.post({
        url: apiUrl,
        data: {
          operationName: 'BasicProfile',
          variables: {},
          query: 'query BasicProfile {\n  profile {\n    distinctId: id\n    ...UserCardFragment\n    __typename\n  }\n}\n\nfragment UserCardFragment on UserInfo {\n  ...TinyUserFragment\n  statsCount {\n    followedCount\n    followingCount\n    __typename\n  }\n  backgroundImage {\n    picUrl\n    __typename\n  }\n  following\n  __typename\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  username\n  screenName\n  briefIntro\n  __typename\n}\n',
        },
      })
      if (res.data.data)
        return await ModuleState.mergeSet(this.module, { data: res.data.data })
      else
        return false
    }
    catch (e) {
      return false
    }
  }

  /**
   * 关注动态流
   */
  async selfFeed(loadMoreKey: {} | undefined = undefined, times = 2): Promise<any> {
    const { apiUrl } = await configState.getItem(this.module)
    try {
      const res = await defHttp.post({
        url: apiUrl,
        data: {
          operationName: 'FetchSelfFeeds',
          variables: {
            loadMoreKey,
          },
          query: 'query FetchSelfFeeds($loadMoreKey: JSON) {\n  viewer {\n    followingUpdates(loadMoreKey: $loadMoreKey) {\n      ...BasicFeedItem\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BasicFeedItem on FeedsConnection {\n  pageInfo {\n    loadMoreKey\n    hasNextPage\n    __typename\n  }\n  nodes {\n    ... on ReadSplitBar {\n      id\n      type\n      text\n      __typename\n    }\n    ... on MessageEssential {\n      ...FeedMessageFragment\n      __typename\n    }\n    ... on UserAction {\n      id\n      type\n      action\n      actionTime\n      ... on UserFollowAction {\n        users {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        allTargetUsers {\n          ...TinyUserFragment\n          following\n          statsCount {\n            followedCount\n            __typename\n          }\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        __typename\n      }\n      ... on UserRespectAction {\n        users {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        targetUsers {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        content\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment FeedMessageFragment on MessageEssential {\n  ...EssentialFragment\n  ... on OriginalPost {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...RootMessageFragment\n    ...UserPostFragment\n    ...MessageInfoFragment\n    pinned {\n      personalUpdate\n      __typename\n    }\n    __typename\n  }\n  ... on Repost {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...UserPostFragment\n    ...RepostFragment\n    pinned {\n      personalUpdate\n      __typename\n    }\n    __typename\n  }\n  ... on Question {\n    ...UserPostFragment\n    __typename\n  }\n  ... on OfficialMessage {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...MessageInfoFragment\n    ...RootMessageFragment\n    __typename\n  }\n  __typename\n}\n\nfragment EssentialFragment on MessageEssential {\n  id\n  type\n  content\n  shareCount\n  repostCount\n  createdAt\n  collected\n  pictures {\n    format\n    watermarkPicUrl\n    picUrl\n    thumbnailUrl\n    smallPicUrl\n    width\n    height\n    __typename\n  }\n  urlsInText {\n    url\n    originalUrl\n    title\n    __typename\n  }\n  __typename\n}\n\nfragment LikeableFragment on LikeableMessage {\n  liked\n  likeCount\n  __typename\n}\n\nfragment CommentableFragment on CommentableMessage {\n  commentCount\n  __typename\n}\n\nfragment RootMessageFragment on RootMessage {\n  topic {\n    id\n    content\n    __typename\n  }\n  __typename\n}\n\nfragment UserPostFragment on MessageUserPost {\n  readTrackInfo\n  user {\n    ...TinyUserFragment\n    __typename\n  }\n  __typename\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  isSponsor\n  username\n  screenName\n  briefIntro\n  __typename\n}\n\nfragment MessageInfoFragment on MessageInfo {\n  video {\n    title\n    type\n    image {\n      picUrl\n      __typename\n    }\n    __typename\n  }\n  linkInfo {\n    originalLinkUrl\n    linkUrl\n    title\n    pictureUrl\n    linkIcon\n    audio {\n      title\n      type\n      image {\n        thumbnailUrl\n        picUrl\n        __typename\n      }\n      author\n      __typename\n    }\n    video {\n      title\n      type\n      image {\n        picUrl\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment RepostFragment on Repost {\n  target {\n    ...RepostTargetFragment\n    __typename\n  }\n  targetType\n  __typename\n}\n\nfragment RepostTargetFragment on RepostTarget {\n  ... on OriginalPost {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    topic {\n      id\n      content\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Repost {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Question {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Answer {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on OfficialMessage {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    __typename\n  }\n  ... on DeletedRepostTarget {\n    status\n    __typename\n  }\n  __typename\n}\n',
        },
      })

      if (res.data.errors)
        throw new Error('Jike Error')
      else
        return res.data.data
    }
    catch (e) {
      if (times > 1) {
        await this.mainPage()
        return this.selfFeed(loadMoreKey, --times)
      }
      else {
        return false
      }
    }
  }

  /**
   * 媒体信息查询
   * @param messageId - 消息 ID
   * @param messageType - 消息类型
   */
  async mediaMeta(messageId: string, messageType: 'ORIGINAL_POST' | 'REPOST' = 'ORIGINAL_POST') {
    const { apiUrl } = await configState.getItem(this.module)
    try {
      const res = await defHttp.post({
        url: apiUrl,
        data: {
          operationName: 'MediaMetaPlay',
          variables: {
            messageId,
            messageType,
          },
          query: 'query MediaMetaPlay($messageId: ID!, $messageType: MessageType!) {\n  mediaMetaPlay(messageId: $messageId, messageType: $messageType) {\n    mediaLink\n    url\n    __typename\n  }\n}\n',
        },
      })

      return res.data.data
    }
    catch (e) {
      return false
    }
  }
}

export default new Jike()
