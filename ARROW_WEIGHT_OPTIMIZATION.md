# 箭头线条粗细优化

## 🔧 问题解决

之前箭头的线条粗细是固定的 `weight: 3`，这导致在设置较小的 `arrowSize` 时，箭头线条相对于箭头大小过粗，影响视觉效果。

## ✨ 优化方案

现在箭头的线条粗细会根据箭头大小自动调整：

```javascript
// 动态计算线条粗细的公式
const arrowWeight = Math.max(1, Math.min(3, Math.ceil(arrowSize / 3)));
```

## 📊 线条粗细对应表

| 箭头大小 (arrowSize) | 线条粗细 (weight) | 效果描述             |
| -------------------- | ----------------- | -------------------- |
| 1-3 像素             | 1                 | 精细线条，适合小箭头 |
| 4-6 像素             | 2                 | 中等线条，平衡效果   |
| 7-9 像素             | 3                 | 较粗线条，清晰可见   |
| 10+ 像素             | 3                 | 保持最大粗细         |

## 🎯 视觉效果改进

### 之前 (固定 weight: 3)

```javascript
arrowSize: 3  → weight: 3  // 线条过粗，箭头变形
arrowSize: 5  → weight: 3  // 线条较粗
arrowSize: 8  → weight: 3  // 线条适中
```

### 现在 (动态调整)

```javascript
arrowSize: 3  → weight: 1  // 线条精细，箭头清晰
arrowSize: 5  → weight: 2  // 线条适中，效果平衡
arrowSize: 8  → weight: 3  // 线条清晰，效果最佳
```

## 💡 使用建议

现在可以放心使用小尺寸箭头了：

```javascript
// 小箭头 - 适合密集轨迹
const player = new L.TrackPlayer(track, {
    arrowSize: 3, // 小箭头
    arrowColor: "#fff",
});

// 中等箭头 - 默认推荐
const player2 = new L.TrackPlayer(track, {
    arrowSize: 5, // 中等箭头
    arrowColor: "#fff",
});

// 大箭头 - 突出显示
const player3 = new L.TrackPlayer(track, {
    arrowSize: 10, // 大箭头
    arrowColor: "#fff",
});
```

## 🔄 动态调整示例

```javascript
// 响应式箭头大小，现在小尺寸也有良好效果
map.on("zoomend", function () {
    const zoom = map.getZoom();
    let arrowSize;

    if (zoom <= 8) {
        arrowSize = 2; // 超小箭头，weight: 1
    } else if (zoom <= 12) {
        arrowSize = 4; // 小箭头，weight: 2
    } else if (zoom <= 16) {
        arrowSize = 6; // 中箭头，weight: 2
    } else {
        arrowSize = 9; // 大箭头，weight: 3
    }

    player.updateArrowStyle({ size: arrowSize });
});
```

现在无论箭头大小如何，线条粗细都会自动匹配，确保最佳的视觉效果！
