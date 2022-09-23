import { ConfigModel } from '@models/index'

export default new class Module {
  /**
   * 获取可以展示卡片的模块
   */
  async getCards() {
    const configs = await ConfigModel.getAll() as any[]
    const cards: string[] = []

    if (!configs.length)
      return cards

    configs.forEach((item) => {
      if (item.enable && item.showCard)
        cards.push(item.key)
    })

    return cards
  }
}()
