import { useConfigState } from '@newTab/store/config'

export function init() {
  useConfigState().setAll()
}
