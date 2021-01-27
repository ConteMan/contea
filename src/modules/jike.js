import dayjs from 'dayjs'
import { sleep, getRandomIntInclusive } from '@/utils'
import request from '@/utils/request.js'
import { infoPut } from '@/service/info.js'
import { put as platformUserPut } from '@/service/platform_user.js'
import { enablePlatformType } from '@/service/config'

export default class Jike {
  constructor() {
    this.baseUrl = 'https://web-api.okjike.com/api/graphql'
    this.platform = 'jike'
    this.username = ''
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Jike()
    }
    return this.instance
  }

  // 个人信息
  userInfo = async() => {
    const res = await request(
      {
        url: this.baseUrl,
        method: 'post',
        data: {
          operationName: 'BasicProfile',
          variables: {},
          query: 'query BasicProfile {\n  profile {\n    distinctId: id\n    ...UserCardFragment\n    __typename\n  }\n}\n\nfragment UserCardFragment on UserInfo {\n  ...TinyUserFragment\n  statsCount {\n    followedCount\n    followingCount\n    __typename\n  }\n  backgroundImage {\n    picUrl\n    __typename\n  }\n  following\n  __typename\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  username\n  screenName\n  briefIntro\n  __typename\n}\n',
        }
      }
    )
    if ((res.status !== 200) || (!res.data.data.profile)) {
      return false
    }
    return res.data.data
  }

  // 登录状态
  loginStatus = async() => {
    const res = await this.userInfo()
    if (!res) {
      return 0
    } else {
      this.putPlatformUser(res)
      return 1
    }
  }

  // 保存个人信息
  putPlatformUser = async(data = {}) => {
    if (!data) {
      data = await this.userInfo()
    }
    data.platform = this.platform
    return await platformUserPut(data)
  }

  // 同步数据
  sync = async() => {
    const res = {}
    const loginStatus = await this.loginStatus()
    if (!loginStatus) {
      return res
    }
    const platformTypes = await enablePlatformType(this.platform)
    for (const platformType of platformTypes) {
      if (platformType === 'jike_activity') {
        const syncRes = await this.syncActivity()
        res[platformType] = syncRes
      }
    }
    return res
  }

  // 动态
  activity = async(
    {
      username = '',
      lastId = '',
    } = {}
  ) => {
    const variables = {
      username: username || this.username
    }
    if (lastId) {
      variables.loadMoreKey = { lastId }
    }
    const res = await request({
      url: this.baseUrl,
      method: 'post',
      data: {
        operationName: 'UserFeeds',
        variables,
        query: 'query UserFeeds($username: String!, $loadMoreKey: JSON) {\n  userProfile(username: $username) {\n    username\n    feeds(loadMoreKey: $loadMoreKey) {\n      ...BasicFeedItem\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BasicFeedItem on FeedsConnection {\n  pageInfo {\n    loadMoreKey\n    hasNextPage\n    __typename\n  }\n  nodes {\n    ... on ReadSplitBar {\n      id\n      type\n      text\n      __typename\n    }\n    ... on MessageEssential {\n      ...FeedMessageFragment\n      __typename\n    }\n    ... on UserAction {\n      id\n      type\n      action\n      actionTime\n      ... on UserFollowAction {\n        users {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        allTargetUsers {\n          ...TinyUserFragment\n          following\n          statsCount {\n            followedCount\n            __typename\n          }\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        __typename\n      }\n      ... on UserRespectAction {\n        users {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        targetUsers {\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          ...TinyUserFragment\n          __typename\n        }\n        content\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment FeedMessageFragment on MessageEssential {\n  ...EssentialFragment\n  ... on OriginalPost {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...RootMessageFragment\n    ...UserPostFragment\n    ...MessageInfoFragment\n    pinned {\n      personalUpdate\n      __typename\n    }\n    __typename\n  }\n  ... on Repost {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...UserPostFragment\n    ...RepostFragment\n    pinned {\n      personalUpdate\n      __typename\n    }\n    __typename\n  }\n  ... on Question {\n    ...UserPostFragment\n    __typename\n  }\n  ... on OfficialMessage {\n    ...LikeableFragment\n    ...CommentableFragment\n    ...MessageInfoFragment\n    ...RootMessageFragment\n    __typename\n  }\n  __typename\n}\n\nfragment EssentialFragment on MessageEssential {\n  id\n  type\n  content\n  shareCount\n  repostCount\n  createdAt\n  collected\n  pictures {\n    format\n    watermarkPicUrl\n    picUrl\n    thumbnailUrl\n    smallPicUrl\n    width\n    height\n    __typename\n  }\n  urlsInText {\n    url\n    originalUrl\n    title\n    __typename\n  }\n  __typename\n}\n\nfragment LikeableFragment on LikeableMessage {\n  liked\n  likeCount\n  __typename\n}\n\nfragment CommentableFragment on CommentableMessage {\n  commentCount\n  __typename\n}\n\nfragment RootMessageFragment on RootMessage {\n  topic {\n    id\n    content\n    __typename\n  }\n  __typename\n}\n\nfragment UserPostFragment on MessageUserPost {\n  readTrackInfo\n  user {\n    ...TinyUserFragment\n    __typename\n  }\n  __typename\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  username\n  screenName\n  briefIntro\n  __typename\n}\n\nfragment MessageInfoFragment on MessageInfo {\n  video {\n    title\n    type\n    image {\n      picUrl\n      __typename\n    }\n    __typename\n  }\n  linkInfo {\n    originalLinkUrl\n    linkUrl\n    title\n    pictureUrl\n    linkIcon\n    audio {\n      title\n      type\n      image {\n        thumbnailUrl\n        picUrl\n        __typename\n      }\n      author\n      __typename\n    }\n    video {\n      title\n      type\n      image {\n        picUrl\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment RepostFragment on Repost {\n  target {\n    ...RepostTargetFragment\n    __typename\n  }\n  targetType\n  __typename\n}\n\nfragment RepostTargetFragment on RepostTarget {\n  ... on OriginalPost {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    topic {\n      id\n      content\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Repost {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Question {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on Answer {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    user {\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n  ... on OfficialMessage {\n    id\n    type\n    content\n    pictures {\n      thumbnailUrl\n      __typename\n    }\n    __typename\n  }\n  ... on DeletedRepostTarget {\n    status\n    __typename\n  }\n  __typename\n}\n'
      },
    })
    if (res.status !== 200) {
      return false
    }
    return res.data
  }

  // 同步动态
  syncActivity = async() => {
    const returnRes = {
      success: 0,
      fail: 0
    }
    const userInfo = await this.userInfo()
    if (!userInfo) {
      return returnRes
    }
    this.username = userInfo.profile.username
    let hasMore = true
    let lastId = ''
    while (hasMore) {
      const res = await this.activity(
        {
          username: this.username,
          lastId,
        }
      )
      if (!res) {
        break
      }
      const items = res.data.userProfile.feeds.nodes
      const pageInfo = res.data.userProfile.feeds.pageInfo
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform
          item.platform_type = 'jike_activity'
          item.info_created_at = dayjs(item.createdAt).unix()
          item.info_updated_at = dayjs(item.createdAt).unix()
          const saveRes = await infoPut(item, ['id'])
          saveRes ? returnRes.success++ : returnRes.fail++
        }
      }
      hasMore = pageInfo.hasNextPage
      lastId = hasMore ? pageInfo.loadMoreKey.lastId : ''
      const sleepTime = getRandomIntInclusive(1000, 3000)
      await sleep(sleepTime)
    }
    return returnRes
  }
}
