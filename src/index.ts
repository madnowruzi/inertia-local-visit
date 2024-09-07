import type { App } from "vue";

type LocalPage = {
  url: string | RegExp;
  component: string;
};

export type LocalPages = Array<LocalPage>;

export function findLocalPage(pathname: string, localPages: LocalPages): LocalPage | undefined {
  const match = localPages.find(({ url }) =>
    url instanceof RegExp ? url.test(pathname) : url === pathname,
  );

  return match;
}

export const InertiaLocalVisit = {
  install(app: App, options: { localPages: LocalPages }) {
    app.config.globalProperties.$localVisit = (url: string, props: Record<string, unknown>) => {
      const pathname = new URL(url).pathname;
      const localPage = findLocalPage(pathname, options.localPages);

      if (!localPage) {
        throw new Error(`Local Page(${url}) Not Found!`);
      }

      const page = { component: localPage.component, url, props };

      //@ts-expect-error we have to use a protected property here
      return app.config.globalProperties.$inertia.setPage(page);
    };
  },
};

declare module "vue" {
  interface ComponentCustomProperties {
    $localVisit: (url: string, props: Record<string, unknown>) => Promise<void>;
  }
}
