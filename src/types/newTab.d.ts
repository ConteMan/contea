import type { GridItem } from 'vue3-drr-grid-layout'

export type DashboardLayoutItem = typeof GridItem & { name: string } & Record<string, string>
export type DashboardLayout = Partial<DashboardLayoutItem>[]