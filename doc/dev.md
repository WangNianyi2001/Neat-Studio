# 开发文档

## 核心数据

### Station

[Station](../src/core/station/station.ts)（数据站）是可以对流经的音频数据施加效果的节点。
一个数据站有固定数目的输入及输出[港](#port)，并可能有截止长度。
常见的数据站有以下这些种类：

- 效果器：有一个输入，一个输出，截止长度与输入有关。
- 音频源：没有输入，有一个输出，截止长度同源数据。
- 扬声器：有一个输入，没有输出，截止长度无限。

#### 字段

- `readonly sockets: Socket[]` 输入港。
- `readonly plugs: Plug[]` 输出港。
- `length: number` 截止长度。

### Port

[Port](../src/core/station/station.ts)（数据港）是数据站中负责收发数据的结构。
它代理了 web audio node 的实际操作。

数据港有两种，分别是 plug（输出港，插头）和 socket（输入港，插座）。
将插头和插座连在一起，就创造了单向的数据流动。
例如，可以将音频源的输出直接连到扬声器的输入，就能够在扬声器中播放该段音频。

一个输出可以引出任意多条线路，但是一个插座只能插一个插头。
因此，可以把一个 plug 连到很多不同的 socket 上去，但是一个 socket 最多只能被一个 plug 连。

#### 字段

- `readonly node: AudioNode` 代理的 web audio node。
- `readonly index: number` 代理的 web audio node 的端口编号。

#### 方法

- `Plug.Connect(source: Socket)` 将输出港连到输入港。
- `Socket.Connect(source: Plug)` 将输入港连到输出港（效果相同）。

## 业务逻辑

### Session

Session（会话）是代表从用户启动应用到退出这一整个生命周期的单例对象。
它储存并维护了一些始终必须存在的数据，如 web audio context、用户登录状态。

#### 字段

- `static current: Session` 当前会话。
- `context: AudioContext` 活动的 web audio context。
- `destination: Destination` 扬声器输出港。
