# TypeScript 支持

本库现在支持 TypeScript，提供完整的类型声明文件。

## 安装

```bash
npm install leaflet-trackplayer
npm install --save-dev @types/leaflet
```

## 使用方法

### 基本用法

```typescript
import * as L from "leaflet";
import "leaflet-trackplayer";

// 创建地图
const map = L.map("map").setView([51.505, -0.09], 13);

// 定义轨迹数据
const track: L.LatLngExpression[] = [
    [51.5, -0.1],
    [51.51, -0.1],
    [51.52, -0.11],
    [51.53, -0.12],
];

// 创建 TrackPlayer 实例，现在有完整的类型支持
const trackPlayer = new L.TrackPlayer(track, {
    speed: 300,
    weight: 6,
    passedLineColor: "#00ff00",
    notPassedLineColor: "#ff0000",
    panTo: true,
    markerRotation: true,
});

// 添加到地图并开始播放
trackPlayer.addTo(map).start();
```

### 配置选项

`TrackPlayerOptions` 接口提供了以下配置选项：

-   `speed?: number` - 播放速度，单位：km/h，默认 600
-   `weight?: number` - 轨迹线宽度，默认 8
-   `markerIcon?: L.Icon` - 自定义标记图标
-   `polylineDecoratorOptions?: any` - 折线装饰器选项
-   `passedLineColor?: string` - 已经过路径颜色，默认 "#0000ff"
-   `notPassedLineColor?: string` - 未经过路径颜色，默认 "#ff0000"
-   `panTo?: boolean` - 是否自动平移到当前位置，默认 true
-   `markerRotationOrigin?: string` - 标记旋转原点，默认 "center"
-   `markerRotationOffset?: number` - 标记旋转偏移角度，默认 0
-   `markerRotation?: boolean` - 是否启用标记旋转，默认 true
-   `progress?: number` - 初始进度，默认 0

### 方法

TrackPlayer 类提供以下方法：

-   `addTo(map: L.Map): this` - 添加到地图
-   `start(): this` - 开始播放
-   `pause(): this` - 暂停播放
-   `stop(): this` - 停止播放
-   `reset(): this` - 重置播放器
-   `setProgress(progress: number): this` - 设置进度 (0-1)
-   `getProgress(): number` - 获取当前进度
-   `remove(): this` - 从地图中移除

## 构建配置

本库使用 Vite 和 `vite-plugin-dts` 插件来生成类型声明文件。构建配置在 `vite.config.js` 中：

```javascript
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            include: ["../src/**/*"],
            exclude: ["examples/**/*"],
            outDir: "../dist",
            insertTypesEntry: true,
            copyDtsFiles: true,
        }),
    ],
    // ... 其他配置
});
```

生成的类型声明文件位于 `dist/TrackPlayer.d.ts`。
