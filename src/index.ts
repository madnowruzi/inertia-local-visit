import type { App } from "vue";

export const InertiaLocalVisit = {
  install(
    app: App,
    options: { localPagesByName: Record<string, { url: string; component: string }> },
  ) {
    app.config.globalProperties.$localVisit = (name: string, props?: Record<string, unknown>) => {
      const page = { ...options.localPagesByName[name], props };
      //@ts-expect-error we have to use a protected property here
      return app.config.globalProperties.$inertia.setPage(page);
    };
  },
};
