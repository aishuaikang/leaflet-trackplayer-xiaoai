# 样式配置示例

## 新增功能

### 1. 箭头控制

-   `showArrows`: 是否显示箭头（默认: true）
-   `arrowColor`: 箭头颜色（默认: "#2196F3"）
-   `arrowSize`: 箭头大小（默认: 6）
-   `arrowOpacity`: 箭头透明度（默认: 0.8）

### 2. 轨迹线样式

-   `passedLineWeight`: 已走过轨迹线宽度（默认: weight + 1）
-   `notPassedLineWeight`: 未走过轨迹线宽度（默认: weight）
-   `passedLineOpacity`: 已走过轨迹线透明度（默认: 0.9）
-   `notPassedLineOpacity`: 未走过轨迹线透明度（默认: 0.7）

## 使用示例

```javascript
// 初始化时配置样式
const player = new L.TrackPlayer(track, {
    // 轨迹线样式
    passedLineColor: "#4CAF50", // 已走过: 绿色
    notPassedLineColor: "#E0E0E0", // 未走过: 浅灰色
    passedLineWeight: 6, // 已走过线宽
    notPassedLineWeight: 4, // 未走过线宽
    passedLineOpacity: 1.0, // 已走过透明度
    notPassedLineOpacity: 0.6, // 未走过透明度

    // 箭头样式
    showArrows: true, // 显示箭头
    arrowColor: "#FF5722", // 箭头颜色: 橙红色
    arrowSize: 8, // 箭头大小
    arrowOpacity: 0.9, // 箭头透明度

    // 其他选项
    speed: 800,
    panTo: true,
});

// 添加到地图
player.addTo(map);

// 动态更新轨迹线样式
player.updateLineStyle({
    passedLineColor: "#2196F3", // 改为蓝色
    passedLineWeight: 8, // 加粗
    notPassedLineColor: "#FFC107", // 改为黄色
    notPassedLineWeight: 3, // 变细
});

// 动态更新箭头样式
player.updateArrowStyle({
    color: "#E91E63", // 改为粉色
    size: 10, // 放大
    opacity: 0.7, // 调整透明度
});

// 隐藏箭头
player.hideArrows();

// 显示箭头
player.showArrows();

// 链式调用
player
    .updateLineStyle({ passedLineColor: "#9C27B0" })
    .updateArrowStyle({ color: "#9C27B0", size: 6 })
    .start();

// 获取当前状态
const state = player.getState();
console.log("当前进度:", state.progress);
console.log("当前位置:", state.currentPosition);
```

## 主题样式预设

```javascript
// 经典蓝色主题
const blueTheme = {
    passedLineColor: "#2196F3",
    notPassedLineColor: "#E3F2FD",
    arrowColor: "#1976D2",
};

// 绿色环保主题
const greenTheme = {
    passedLineColor: "#4CAF50",
    notPassedLineColor: "#E8F5E8",
    arrowColor: "#388E3C",
};

// 橙色活力主题
const orangeTheme = {
    passedLineColor: "#FF9800",
    notPassedLineColor: "#FFF3E0",
    arrowColor: "#F57C00",
};

// 应用主题
player.updateLineStyle(blueTheme);
player.updateArrowStyle({ color: blueTheme.arrowColor });
```

## 响应式设计

```javascript
// 根据地图缩放级别调整样式
map.on("zoomend", function () {
    const zoom = map.getZoom();
    const lineWeight = Math.max(2, zoom - 8);
    const arrowSize = Math.max(4, zoom - 6);

    player.updateLineStyle({
        passedLineWeight: lineWeight + 2,
        notPassedLineWeight: lineWeight,
    });

    player.updateArrowStyle({
        size: arrowSize,
    });
});
```
