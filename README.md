<p>
  <a href="https://www.npmjs.com/package/@madnow/inertia-local-visit"><img src="https://img.shields.io/npm/v/%40madnow%2Finertia-local-visit" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@madnow/inertia-local-visit"><img src="https://img.shields.io/npm/dt/%40madnow%2Finertia-local-visit" alt="npm downloads"></a>
  <a href="https://github.com/madnowruzi/inertia-local-visit/blob/main/LICENSE"><img src="https://img.shields.io/github/license/madnowruzi/inertia-local-visit" alt="License"></a>
</p>

# @madnow/inertia-local-visit

A vue.js plugin to add local visit capability to Inertia.js v1.\*

Based on https://github.com/inertiajs/inertia/discussions/261#discussioncomment-225570

## Usage

```sh
# install
npm i @madnow/inertia-local-visit
```

```ts
// resources/app.ts
import { InertiaLocalVisit, findLocalPage, type LocalPages } from "@madnow/inertia-local-visit";

const localPages: LocalPages = [
  { url: "/some-pages/page1", component: "SomePages/Page1" },
  { url: "/some-pages/page2", component: "SomePages/Page2" },
  { url: /^\/another-set-of-pages\/\d+$/, component: "AnotherSetOfPages/Show" },
];

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
      const matched = findLocalPage(window.location.pathname, localPages);

      if (matched) {
        initialPage = {
          url: window.location.pathname,
          component: matched.component,
        };
      }
    }

    props.initialPage = initialPage;

    const vueApp = createApp({ render: () => h(App, props) });
    vueApp.use(plugin).use(ZiggyVue).use(InertiaLocalVisit, { localPages }).mount(el);
  },
});
```

```vue
// some-component.vue

<script>
import { getCurrentInstance, toRaw } from "vue";

const { appContext } = getCurrentInstance()!;
const onClickHandler = () => {
  appContext.config.globalProperties.$localVisit(
      route("some.route.name"),
      {
        prop1: somePrimitiveValueOrProxy,
        prop2: toRaw(someComplexProxy),
      },
    );
}
</script>
```

## License

[MIT](./LICENSE)
