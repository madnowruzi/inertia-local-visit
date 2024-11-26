import { createHeadManager, Page, router } from "@inertiajs/core"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $inertia: typeof router
    $page: Page
    $headManager: ReturnType<typeof createHeadManager>
  }
  interface ComponentCustomOptions {
    remember?:
      | string
      | string[]
      | {
          data: string | string[]
          key?: string | (() => string)
        }
  }
}
