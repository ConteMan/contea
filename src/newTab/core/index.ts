import { useConfigState } from '~/store/config'

export function init() {
  useConfigState().setAll()
}
