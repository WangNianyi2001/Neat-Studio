# 开发文档

## 核心数据

### Station

[Station](../src/core/station.ts)（数据站）是可以对流经的音频数据施加效果的节点。
一个数据站有固定数目的输入及输出[港](#port)，并可能有截止长度。
举一些常见数据站的例子：

- 效果器：有一个输入，一个输出，截止长度与输入有关。
- 音频源：没有输入，有一个输出，截止长度同源数据。
- 扬声器：有一个输入，没有输出，截止长度无限。

#### 字段

- `readonly imports: Import[]` 输入港。
- `readonly exports: Export[]` 输出港。
- `length: number` 截止长度。

### Port

Port（数据港）是连系数据站的先决结构，负责周转运行于数据站间的数据。

每个数据站都可能有两种数据港：Export（输出港）和 Import（输入港）。
将输出港连到输入港上，就创造了数据的单向流动路径。
一个输出港可以引出任意多条线路，但是一个输入港只能接收一方的数据。

数据港传递的数据不一定是朴素的音频数据，也可能是频谱、soundfont 等，
因此 [`station.ts`](../src/core/station.ts) 中定义的只是数据港的抽象类；
具体的实现由其他脚本提供，如 [`audio.ts`](../src/core/audio.ts) 中实现了 web audio node 的代理。

数据港有这些实际用途：

- 将音频源连到扬声器，以在扬声器中播放音频。
- 将 VST 连到钢琴窗，以为乐段提供音色。

#### 方法

- `Export.Connect(destination: Import)` 将输出港连到输入港。
- `Import.Disconnect(source: Export)` 将输出港与相连的输入港断开。

## 业务逻辑

### Session

[Session](../src/session.ts)（会话）是代表从用户启动应用到退出这一整个生命周期的单例对象。
它储存并维护了一些始终必须存在的数据，如 web audio context、用户登录状态。

#### 字段

- `static current: Session` 当前会话。
- `context: AudioContext` 活动的 web audio context。
- `destination: Destination` 扬声器输出港。
