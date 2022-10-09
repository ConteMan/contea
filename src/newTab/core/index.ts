import { useConfigState, useModalState } from '@newTab/store/index'

export function init() {
  useConfigState().setAll()
  useModalState().dealModal()
}
