import Dexie, { Table } from 'dexie'
import {
  makeKMap,
  AsyncAbstractDriverFactory,
  AsyncAbstractDriverInterface,
  KMap,
  AsyncBaseModel,
  clone,
  SyncAbstractDriverInterface,
} from 'kurimudb'

export interface DexieDriver extends AsyncAbstractDriverInterface {
  query(): Table
  getPrimaryName(): string
  restorePrimaryType(key: string): number | string
  all(): Promise<KMap<any>>
  getLength(): Promise<number>
  paginate(
    currentPpage: number,
    num: number,
    orderBy?: string | Array<string>,
    isReverse?: boolean,
  ): Promise<KMap<any>>
  arrayToKMap<ValueType>(arr: Array<any>): KMap<ValueType>
}

export const encode = (value: unknown) => {
  let proto = value
  while (Object.getPrototypeOf(proto) !== null)
    proto = Object.getPrototypeOf(proto)

  if (
    Object.getPrototypeOf(value) === null
    || Object.getPrototypeOf(value) === proto
  ) {
    return value as Record<string, unknown>
  }
  else {
    const data = Object.create(null)
    data.$__value = value
    return data
  }
}

export const decode = (value: Record<string, unknown>) => {
  if (typeof value === 'object' && '$__value' in value)
    return value.$__value
  else
    return value
}

class DexieDriverFactory extends AsyncAbstractDriverFactory {
  make<
    DataType,
    DriverType extends
    | AsyncAbstractDriverInterface
    | SyncAbstractDriverInterface
    | undefined,
  >(model: AsyncBaseModel<DataType, DriverType>) {
    const options = model.options
    if (undefined === options?.db) {
      throw new Error(
        '[Kurimudb] The "db" parameter was not passed in the Model constructor, this param is required when using DexieDriver.',
      )
    }

    const db = options.db as Dexie

    const product: DexieDriver = {
      query() {
        return db.table(options.name)
      },

      getPrimaryName() {
        return this.query().schema.primKey.name
      },

      restorePrimaryType(key: string) {
        if (this.query().schema.primKey.auto === true) {
          // 如果是自动递增的主键，则转为 number 类型
          return Number(key)
        }
        else {
          // 其余情况，均使用 string 类型
          return String(key)
        }
      },

      insert(key: string, value: unknown) {
        return new Promise((resolve, reject) => {
          this.query()
            .add(encode(value), this.restorePrimaryType(key))
            .then(() => resolve(true))
            .catch((error) => {
              if (error?.name === 'ConstraintError') resolve(false)
              else reject(error)
            })
        })
      },

      async update(key: string, value: unknown) {
        return (
          (await this.query().update(
            this.restorePrimaryType(key),
            encode(value),
          ))
          === 1
        )
      },

      async insertOrUpdate(key: string, value: unknown) {
        // console.warn('insertOrUpdate', encode(value))

        const data = encode(value)
        data[this.getPrimaryName()] = this.restorePrimaryType(key)
        await this.query().put(data)
      },

      async insertAutoIncrement(value: unknown) {
        // console.warn('insertAutoIncrement', encode(value))

        return String(await this.query().add(encode(value)))
      },

      async select(key: string) {
        return decode(await this.query().get(this.restorePrimaryType(key)))
      },

      async exists(key: string) {
        return (
          (await this.query()
            .where(this.getPrimaryName())
            .equals(this.restorePrimaryType(key))
            .count()) > 0
        )
      },

      async delete(key: string) {
        await this.query().delete(key)

        return true
      },

      bulkInsert(items: Record<string, unknown>) {
        const itemsArr: Array<unknown> = []
        // eslint-disable-next-line no-restricted-syntax
        for (const key in items) {
          const item = encode(items[key])
          item[this.getPrimaryName()] = this.restorePrimaryType(key)
          itemsArr.push(item)
        }

        return new Promise((resolve) => {
          db.transaction('rw', this.query(), async() => {
            await this.query().bulkAdd(itemsArr)
            resolve(true)
          }).catch((error) => {
            if (error?.name !== 'BulkError') throw error
          })
        })
      },

      bulkInsertAutoIncrement(items: Array<unknown>) {
        const itemsArr: Array<unknown> = []
        // eslint-disable-next-line no-restricted-syntax
        for (const key in items) {
          const item = encode(items[key])
          itemsArr.push(item)
        }

        return new Promise((resolve) => {
          db.transaction('rw', this.query(), async() => {
            resolve(
              (await this.query().bulkAdd(itemsArr, { allKeys: true })).map(
                v => String(v),
              ),
            )
          }).catch((error) => {
            if (error?.name !== 'BulkError') throw error
          })
        })
      },

      async bulkUpdate(items: Record<string, unknown>) {
        const itemsArr: Array<unknown> = []
        // eslint-disable-next-line no-restricted-syntax
        for (const key in items) {
          const item = encode(items[key])
          item[this.getPrimaryName()] = this.restorePrimaryType(key)
          itemsArr.push(item)
        }

        return new Promise((resolve) => {
          db.transaction('rw', this.query(), async() => {
            await this.query().bulkPut(itemsArr)
            resolve(true)
          }).catch((error) => {
            if (error?.name !== 'BulkError') throw error
          })
        })
      },

      async bulkInsertOrUpdate(items: Record<string, unknown>) {
        const itemsArr: Array<unknown> = []
        // eslint-disable-next-line no-restricted-syntax
        for (const key in items) {
          const item = encode(items[key])
          item[this.getPrimaryName()] = this.restorePrimaryType(key)
          itemsArr.push(item)
        }

        return new Promise((resolve) => {
          db.transaction('rw', this.query(), async() => {
            await this.query().bulkPut(itemsArr)
            resolve(true)
          }).catch((error) => {
            if (error?.name !== 'BulkError') throw error
          })
        })
      },

      async bulkSelect(keys: Array<string>) {
        const res = await this.query().bulkGet(
          keys.map(v => this.restorePrimaryType(v)),
        )

        const data = makeKMap()
        for (let index = 0; index < keys.length; index++)
          data[keys[index]] = decode(res[index])

        return data
      },

      async bulkDelete(keys: Array<string>) {
        await this.query().bulkDelete(
          keys.map(v => this.restorePrimaryType(v)),
        )

        return true
      },

      async paginate(
        currentPpage: number,
        num: number,
        orderBy?: string | Array<string>,
        isReverse?: boolean,
      ) {
        if (currentPpage < 1) currentPpage = 1
        const query = this.query()
        if (undefined !== orderBy) query.orderBy(orderBy)
        if (undefined !== isReverse) query.reverse()
        const res: Array<Record<string, unknown>> = await query
          .offset((currentPpage - 1) * num)
          .limit(num)
          .toArray()

        const data = makeKMap()
        // eslint-disable-next-line no-restricted-syntax
        for (const key in res) {
          const item = res[key]
          data[item[this.getPrimaryName()] as string] = decode(item)
        }

        return data
      },

      async seeding(seeding: Function) {
        const table = db.table('_seed')
        if (await table.get(`${options.name}_is_seeded`)) return

        await table.add({
          _id: `${options.name}_is_seeded`,
          value: 'true',
        })
        await seeding(model)
      },

      async clone(value: unknown) {
        return clone(value)
      },

      async all() {
        const res = makeKMap();
        (await this.query().toArray()).forEach((value) => {
          res[value[this.getPrimaryName()]] = decode(value)
        })
        return res
      },

      async getLength() {
        return this.query().count()
      },

      arrayToKMap<ValueType>(arr: Array<any>) {
        const map = makeKMap<ValueType>()
        for (const item of arr) {
          const key = item[this.getPrimaryName()]
          map[key] = decode(item) as ValueType
        }

        return map
      },
    }

    return product
  }
}

export const dexieDriverFactory = new DexieDriverFactory()
