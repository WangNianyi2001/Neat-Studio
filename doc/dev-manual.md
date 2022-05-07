# 开发文档

## 核心数据

### Station

[Station](../src/core/station.ts)（数据站）是可以对流经的音频数据施加效果的节点。
一个数据站有固定数目的输入及输出[港](#port)，并可能有截止长度。

常见的数据站有：

- 效果器：有一个输入，一个输出，截止长度与输入有关。
- 音频源：没有输入，有一个输出，截止长度同源数据。
- 扬声器：有一个输入，没有输出，截止长度无限。

#### 字段

- `readonly imports: Import[]` 输入港。
- `readonly exports: Export[]` 输出港。
- `length: number` 截止长度。

### Port

Port（数据港）是连系数据站的先决结构，负责周转运行于数据站间的数据。

每种类型的数据港都有另一个（些）与之对应的类型，称为本类型的 peer（伙伴）；只有类型对应的数据港之间才能传递数据。
[最常见的一对数据港类型](../src/core/audio.ts)是 `Audio.Export`（音频输出）和 `Audio.Import`（音频输入）。
将输出港连到输入港上，就建立了音频的单向流动。

数据港传递的数据不一定是朴素的音频数据，也可能是频谱、soundfont 等，
因此 [`station.ts`](../src/core/station.ts) 中定义的只是数据港的接口，具体的实现由其他脚本提供。

数据港有这些实际用途：

- 将音频源连到扬声器，以在扬声器中播放音频。
- 将 VST 连到钢琴窗，以为乐段提供音色。

#### 方法

- `Connect(target: Peer)` 将输出港连到输入港。
- `Disconnect(target: Peer)` 将输出港与相连的输入港断开。

## 业务逻辑

### Session

[Session](../src/session.ts)（会话）是代表从用户启动应用到退出这一整个生命周期的单例对象。
它储存并维护了一些始终必须存在的数据，如 web audio context、用户登录状态。

#### 字段

- `static current: Session` 当前会话。
- `context: AudioContext` 活动的 web audio context。
- `destination: Destination` 扬声器输出港。
