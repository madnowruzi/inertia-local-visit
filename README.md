<p>
  <a href="https://www.npmjs.com/package/@madnow/inertia-local-visit"><img src="https://img.shields.io/npm/v/%40madnow%2Finertia-local-visit" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@madnow/inertia-local-visit"><img src="https://img.shields.io/npm/dt/%40madnow%2Finertia-local-visit" alt="npm downloads"></a>
  <a href="https://github.com/madnowruzi/inertia-local-visit/blob/main/LICENSE"><img src="https://img.shields.io/github/license/madnowruzi/inertia-local-visit" alt="License"></a>
</p>

# @madnow/inertia-local-visit

A vue.js plugin to add local visit capability to Inertia.js v1.\*

Based on https://github.com/inertiajs/inertia/discussions/261#discussioncomment-225570

## Usage

Install:

```sh
# npm
npm i @madnow/inertia-local-visit
```

Usage:

```ts
// resources/app.ts
import type { Page as InertiaPage } from "@inertiajs/core";
import { InertiaLocalVisit } from "@madnow/inertia-local-visit";

type Page = Partial<InertiaPage> & Pick<InertiaPage, "url" | "component">;

const localPagesByName: Record<string, Page> = {
  "some-pages.page1": { url: "/some-pages/page1", component: "SomePages/Page1" },
  "some-pages.page2": { url: "/some-pages/page2", component: "SomePages/Page2" },
  "some-pages.page3": { url: "/some-pages/page3", component: "SomePages/Page3" },
};

const localPagesByPathname: Record<string, Page> = Object.fromEntries(
  Object.entries(localPagesByName).map(([_, page]) => {
    return [page.url, page];
  }),
);

void createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob<DefineComponent>("./Pages/**/*.vue"),
    ),
  setup({ el, App, props, plugin }) {
    // @ts-expect-error fails to recognize dataset
    let initialPage = JSON.parse(el.dataset.page);
    if (initialPage.component === "not-found") {
      const page = localPagesByPathname[window.location.pathname];
      if (page) initialPage = page;
    }

    props.initialPage = initialPage;

    const vueApp = createApp({ render: () => h(App, props) });
    vueApp.use(plugin).use(ZiggyVue).use(InertiaLocalVisit, { localPagesByName }).mount(el);
  },
});
```

## License

[MIT](./LICENSE)
