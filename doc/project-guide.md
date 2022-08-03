# 项目指南

此项目用 TypeScript 开发，本地由 vite 部署在 node.js 环境中。

## 调试、构建

- 启动测试服务器：
	运行 `npm run dev`，访问 `localhost:3000`。
- 编译发布：
	运行 `npm run build`。

## 目录结构

```plaintext
/
+ dist/	发布目录
+ doc/	说明文件
+ src/	源码
	+ core/	核心代码
	+ ui/	界面代码
	+ neat-studio.ts	依赖集总
+ tests/	测试页面
index.html	主页面
```

## 附录

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
