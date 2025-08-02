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
             * 从地图中移除
             */
            remove(): void;

            /**
             * 开始播放
             */
            start(): void;

            /**
             * 暂停播放
             */
            pause(): void;

            /**
             * 恢复播放
             */
            startAction(): void;

            playAction(): void;

            setSpeedAction(speed: number): void;

            setSpeed(speed: number, wait?: number): Promise<void>;

            /**
             * 设置进度
             * @param progress 进度值 (0-1)
             */
            setProgress(progress: number): void;

            /**
             * 事件监听器
             * @param type 事件类型 start | pause | finished | progress
             * @param fn 事件处理函数
             */
            on(
                type: "start" | "pause" | "finished" | "progress",
                fn: (
                    progress: TrackPlayerOptions["progress"],
                    latlng: L.LatLng,
                    index: number
                ) => void
            ): this;
            /**
             * 事件移除监听器
             * @param type 事件类型
             * @param fn 事件处理函数
             */
            off(
                type: "start" | "pause" | "finished" | "progress",
                fn: (...args: any[]) => void
            ): this;
        }
    }
}
