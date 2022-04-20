# 项目开发手册

此项目用 TypeScript + Vue.js 开发。

## 调试、构建

- 编译：
	运行 `npm run build`。
- 本地浏览器调试：
	运行 `npm run localhost`，访问 `localhost:3000`。

## 目录结构

```plaintext
/
+ *		配置、说明文件
+ index.html	主页面
+ src/	源码
	+ core/	核心代码
	+ ui/	界面代码
	+ neat-studio.ts	模块依赖集总
```

## 注释

浏览器原生不支持裸模块引用（即如 `import _ from 'lodash'` 这种非目录的引用）。
为了使用 Vue.js，最佳实践是通过 [import-maps](
	https://github.com/WICG/import-maps
) 来指定裸模块的引用路径。
然而这个特性目前只有 Edge、Chrome 和 Opera [支持](
	https://caniuse.com/import-maps
)了。
在其他浏览器上可以用 [es-module-shims](
	https://github.com/guybedford/es-module-shims
) 这个 polyfill 来提供支持。
