import { useConfigState, useModalState, useNewTabState } from '@newTab/store/index'

export async function init() {
  await useConfigState().setAll()
  const dealRes = await useModalState().dealModal()
  if (!dealRes) // 没有搜索标记，初始化结束
    useNewTabState().setInit()
}
