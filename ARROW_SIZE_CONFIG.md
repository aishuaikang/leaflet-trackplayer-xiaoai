## 箭头大小参数调整测试

箭头大小现在可以通过以下方式进行调整：

### 1. 初始化时设置箭头大小

```javascript
// 创建轨迹播放器时设置箭头大小
const player = new L.TrackPlayer(track, {
    arrowSize: 8, // 设置箭头大小为8像素
    arrowColor: "#fff", // 箭头颜色
    arrowOpacity: 1.0, // 箭头透明度
});
```

### 2. 动态调整箭头大小

```javascript
// 动态更新箭头大小
player.updateArrowStyle({
    size: 10, // 调整箭头大小为10像素
    color: "#ff0000", // 同时可以改变颜色
    opacity: 0.8, // 调整透明度
});

// 只调整大小
player.updateArrowStyle({ size: 12 });

// 链式调用
player.updateArrowStyle({ size: 6, color: "#00ff00" }).start();
```

### 3. 响应式箭头大小

```javascript
// 根据地图缩放级别动态调整箭头大小
map.on("zoomend", function () {
    const zoom = map.getZoom();
    let arrowSize;

    if (zoom <= 10) {
        arrowSize = 3; // 缩放级别低时使用小箭头
    } else if (zoom <= 15) {
        arrowSize = 5; // 中等缩放使用中等箭头
    } else {
        arrowSize = 8; // 高缩放级别使用大箭头
    }

    player.updateArrowStyle({ size: arrowSize });
});
```

### 4. 预设箭头大小

```javascript
// 小箭头主题
const smallArrowTheme = {
    size: 3,
    color: "#fff",
    opacity: 0.9,
};

// 中等箭头主题
const mediumArrowTheme = {
    size: 6,
    color: "#fff",
    opacity: 1.0,
};

// 大箭头主题
const largeArrowTheme = {
    size: 10,
    color: "#ffff00",
    opacity: 1.0,
};

// 应用主题
player.updateArrowStyle(mediumArrowTheme);
```

### 5. 完整配置示例

```javascript
const player = new L.TrackPlayer(trackData, {
    // 轨迹线配置
    weight: 5,
    passedLineColor: "#0000ff",
    notPassedLineColor: "#ff0000",

    // 箭头配置
    showArrows: true,
    arrowSize: 7, // 自定义箭头大小
    arrowColor: "#ffffff", // 箭头颜色
    arrowOpacity: 1.0, // 箭头透明度

    // 播放配置
    speed: 600,
    panTo: true,
});

// 添加到地图
player.addTo(map);

// 动态调整（例如用户界面控制）
document
    .getElementById("arrowSizeSlider")
    .addEventListener("input", function (e) {
        const size = parseInt(e.target.value);
        player.updateArrowStyle({ size: size });
    });
```

### 6. 箭头大小建议

-   **小尺寸 (3-4 像素)**: 适合密集轨迹或移动设备
-   **中等尺寸 (5-6 像素)**: 默认推荐大小，平衡美观与性能
-   **大尺寸 (7-10 像素)**: 适合重要轨迹或大屏幕显示
-   **超大尺寸 (11+像素)**: 特殊展示需求

箭头大小参数现在完全可配置，支持初始化设置和动态调整！
