// TypeScript 使用示例
import * as L from "leaflet";
import "leaflet-trackplayer";
import "./leaflet-trackplayer.d.ts";

// 创建地图
const map = L.map("map").setView([51.505, -0.09], 13);

// 添加瓦片图层
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

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

// 类型安全的方法调用
trackPlayer.pause();
trackPlayer.setProgress(0.5);
const _currentProgress: number = trackPlayer.getProgress();
