const drawFn = async() => {
  // 查询今日是否有免费抽奖机会
  const today = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers: {
      cookie: document.cookie,
    },
    method: 'GET',
    credentials: 'include',
  }).then((res: any) => res.json())

  if (today.err_no !== 0) {
    return {
      error: true,
    }
  }
  if (today.data.free_count === 0) {
    return {
      error: false,
      des: '今日已经免费抽奖！',
    }
  }

  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers: {
      cookie: document.cookie,
    },
    method: 'POST',
    credentials: 'include',
  }).then((res: any) => res.json())

  if (draw.err_no !== 0) {
    return {
      error: draw.err_no,
    }
  }
  return {
    error: false,
    detail: draw.data,
  }
}

// 签到
const sign = async() => {
  // 查询今日是否已经签到
  const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
    headers: {
      cookie: document.cookie,
    },
    method: 'GET',
    credentials: 'include',
  }).then((res: any) => res.json())

  if (today_status.err_no !== 0) {
    return {
      error: today_status.err_no,
    }
  }
  if (today_status.data) {
    return {
      error: false,
      des: '今日已经签到',
    }
  }

  // 签到
  const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers: {
      cookie: document.cookie,
    },
    method: 'POST',
    credentials: 'include',
  }).then((res: any) => res.json())

  if (check_in.err_no !== 0) {
    return {
      error: check_in.err_no,
    }
  }
  return {
    error: false,
    data: check_in.data,
  }
}

export { drawFn, sign }
