import * as L from "leaflet";

declare global {
    namespace L {
        interface TrackPlayerOptions {
            /** 播放速度，单位：km/h，默认 600 */
            speed?: number;
            /** 轨迹线宽度，默认 8 */
            weight?: number;
            /** 自定义标记图标 */
            markerIcon?: L.Icon;
            /** 折线装饰器选项 */
            polylineDecoratorOptions?: any;
            /** 已经过路径颜色，默认 "#0000ff" */
            passedLineColor?: string;
            /** 未经过路径颜色，默认 "#ff0000" */
            notPassedLineColor?: string;
            /** 是否自动平移到当前位置，默认 true */
            panTo?: boolean;
            /** 标记旋转原点，默认 "center" */
            markerRotationOrigin?: string;
            /** 标记旋转偏移角度，默认 0 */
            markerRotationOffset?: number;
            /** 是否启用标记旋转，默认 true */
            markerRotation?: boolean;
            /** 初始进度，默认 0 */
            progress?: number;
        }

        class TrackPlayer {
            /** 轨迹数据 */
            track: any;
            /** 距离切片数组 */
            distanceSlice: number[];
            /** 总距离 */
            distance: number;
            /** 是否已添加到地图 */
            addedToMap: boolean;
            /** 配置选项 */
            options: TrackPlayerOptions;
            /** 初始进度 */
            initProgress: number;
            /** 是否暂停 */
            isPaused: boolean;
            /** 已行走距离 */
            walkedDistance: number;
            /** 临时已行走距离 */
            walkedDistanceTemp: number;

            /**
             * 创建轨迹播放器实例
             * @param track 轨迹数据，支持多种格式
             * @param options 配置选项
             */
            constructor(
                track: L.LatLngExpression[] | L.LatLngExpression[][],
                options?: TrackPlayerOptions
            );

            /**
             * 添加到地图
             * @param map Leaflet 地图实例
             */
            addTo(map: L.Map): this;

            /**
             * 开始播放
             */
            start(): this;

            /**
             * 暂停播放
             */
            pause(): this;

            /**
             * 停止播放
             */
            stop(): this;

            /**
             * 重置播放器
             */
            reset(): this;

            /**
             * 设置进度
             * @param progress 进度值 (0-1)
             */
            setProgress(progress: number): this;

            /**
             * 获取当前进度
             */
            getProgress(): number;

            /**
             * 从地图中移除
             */
            remove(): this;
        }
    }
}
