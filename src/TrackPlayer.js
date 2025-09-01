import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet-polylinedecorator";
import "leaflet-rotatedmarker";

L.TrackPlayer = class {
    constructor(track, options = {}) {
        // 初始化轨迹数据
        this._initializeTrack(track);

        // 配置选项
        this.options = this._mergeOptions(options);
        this.initProgress = options.progress;

        // 播放状态
        this.addedToMap = false;
        this.isPaused = true;
        this.finished = false;
        this.walkedDistance = 0;
        this.walkedDistanceTemp = 0;
        this.trackIndex = 0;

        // 时间戳
        this.startTimestamp = 0;
        this.pauseTimestamp = 0;

        // 事件监听器
        this.events = {
            start: [],
            pause: [],
            finished: [],
            progress: [],
        };
    }

    /**
     * 初始化轨迹数据
     */
    _initializeTrack(track) {
        // 格式化传入的轨迹数组，支持多种格式
        const leafletLatlngs = L.polyline(track)._latlngs;
        this.track = turf.lineString(
            leafletLatlngs.map(({ lng, lat }) => [lng, lat])
        );

        // 计算累积距离
        this.distanceSlice = this._calculateDistanceSlices();
        this.distance = turf.length(this.track);
    }

    /**
     * 计算每个点的累积距离
     */
    _calculateDistanceSlices() {
        const distances = [0];
        const coordinates = this.track.geometry.coordinates;

        for (let i = 1; i < coordinates.length; i++) {
            const line = turf.lineString(coordinates.slice(0, i + 1));
            distances.push(turf.length(line));
        }

        return distances;
    }

    /**
     * 合并配置选项
     */
    _mergeOptions(options) {
        return {
            speed: options.speed ?? 600,
            weight: options.weight ?? 5,
            passedLineWeight:
                options.passedLineWeight ?? (options.weight ?? 5) + 1,
            notPassedLineWeight:
                options.notPassedLineWeight ?? options.weight ?? 5,
            markerIcon: options.markerIcon,
            showArrows: options.showArrows ?? true,
            arrowColor: options.arrowColor ?? "#fff",
            arrowSize: options.arrowSize ?? 5,
            arrowOpacity: options.arrowOpacity ?? 1.0,
            polylineDecoratorOptions:
                options.polylineDecoratorOptions ??
                this._getDefaultDecoratorOptions(options),
            passedLineColor: options.passedLineColor ?? "#0000ff",
            notPassedLineColor: options.notPassedLineColor ?? "#ff0000",
            passedLineOpacity: options.passedLineOpacity ?? 1.0,
            notPassedLineOpacity: options.notPassedLineOpacity ?? 1.0,
            panTo: options.panTo ?? true,
            markerRotationOrigin: options.markerRotationOrigin ?? "center",
            markerRotationOffset: options.markerRotationOffset ?? 0,
            markerRotation: options.markerRotation ?? true,
            progress: options.progress ?? 0,
        };
    }

    /**
     * 获取默认装饰器选项
     */
    _getDefaultDecoratorOptions(options = {}) {
        const arrowSize = options.arrowSize ?? 5;
        // 根据箭头大小动态计算线条粗细，最小为1，最大为3
        const arrowWeight = Math.max(1, Math.min(3, Math.ceil(arrowSize / 3)));

        return {
            patterns: [
                {
                    offset: 30,
                    repeat: 60,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: arrowSize,
                        headAngle: 60,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            weight: arrowWeight,
                            color: options.arrowColor ?? "#fff",
                            opacity: options.arrowOpacity ?? 1.0,
                        },
                    }),
                },
            ],
        };
    }
    /**
     * 添加到地图
     */
    addTo(map) {
        if (this.addedToMap) return this;

        this.map = map;
        this.addedToMap = true;

        this._createMarker();
        this._createLines();
        this._createDecorator();

        if (this.initProgress) {
            this.setProgress(this.initProgress);
        }

        return this;
    }

    /**
     * 创建标记点
     */
    _createMarker() {
        if (!this.options.markerIcon) return;

        const [lng, lat] = this.track.geometry.coordinates[0];
        this.marker = L.marker([lat, lng], {
            icon: this.options.markerIcon,
        }).addTo(this.map);

        if (this.options.markerRotation) {
            this._setInitialMarkerRotation();
        }
    }

    /**
     * 设置初始标记旋转角度
     */
    _setInitialMarkerRotation() {
        const coordinates = this.track.geometry.coordinates;
        const bearing = turf.bearing(coordinates[0], coordinates[1]);

        this.marker.setRotationAngle(
            bearing / 2 + this.options.markerRotationOffset / 2
        );
        this.marker.setRotationOrigin(this.options.markerRotationOrigin);
    }

    /**
     * 创建轨迹线
     */
    _createLines() {
        const path = this.track.geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
        ]);

        this.notPassedLine = L.polyline(path, {
            weight: this.options.notPassedLineWeight,
            color: this.options.notPassedLineColor,
            opacity: this.options.notPassedLineOpacity,
        }).addTo(this.map);

        this.passedLine = L.polyline([], {
            weight: this.options.passedLineWeight,
            color: this.options.passedLineColor,
            opacity: this.options.passedLineOpacity,
        }).addTo(this.map);
    }

    /**
     * 创建装饰器
     */
    _createDecorator() {
        if (!this.options.showArrows) return;

        const path = this.track.geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
        ]);
        this.polylineDecorator = L.polylineDecorator(
            path,
            this.options.polylineDecoratorOptions
        ).addTo(this.map);
    }
    /**
     * 从地图移除
     */
    remove() {
        if (!this.addedToMap) return this;

        this.addedToMap = false;
        this._cleanup();
        this._resetState();

        return this;
    }

    /**
     * 清理地图元素
     */
    _cleanup() {
        this.polylineDecorator?.remove();
        this.notPassedLine?.remove();
        this.passedLine?.remove();
        this.marker?.remove();

        this.polylineDecorator = null;
        this.notPassedLine = null;
        this.passedLine = null;
        this.marker = null;
    }

    /**
     * 重置状态
     */
    _resetState() {
        this.finished = false;
        this.startTimestamp = 0;
        this.pauseTimestamp = 0;
        this.walkedDistanceTemp = 0;
        this.walkedDistance = 0;
        this.trackIndex = 0;
        this.isPaused = true;
        this.options.progress = this.initProgress;
    }
    /**
     * 开始播放
     */
    start() {
        if ((!this.isPaused && !this.finished) || !this.addedToMap) return this;

        this._prepareStart();
        this.isPaused = false;
        this.finished = false;

        this._adjustTimestamp();
        this._startAnimation();
        this._emit("start");

        if (this.initProgress) {
            this.setProgress(this.initProgress);
        }

        return this;
    }

    /**
     * 准备开始播放
     */
    _prepareStart() {
        if (this.options.progress === 0 || this.options.progress === 1) {
            this.startTimestamp = 0;
            this.pauseTimestamp = 0;
            this.walkedDistanceTemp = 0;
            this.walkedDistance = 0;
        }
    }

    /**
     * 调整时间戳
     */
    _adjustTimestamp() {
        if (this.pauseTimestamp && this.startTimestamp) {
            this.startTimestamp += Date.now() - this.pauseTimestamp;
        }
    }

    /**
     * 暂停播放
     */
    pause() {
        if (this.isPaused || this.finished) return this;

        this.pauseTimestamp = Date.now();
        this.isPaused = true;
        this._emit("pause");

        return this;
    }
    /**
     * 开始动画循环
     */
    _startAnimation() {
        const distance = this.distance;
        const totalDuration = (distance / this.options.speed) * 3600 * 1000;

        const animate = (timestamp) => {
            if (timestamp && this.addedToMap) {
                this.startTimestamp ||= timestamp;
                const elapsed = timestamp - this.startTimestamp;
                this.walkedDistance = Math.min(
                    distance,
                    (distance * elapsed) / totalDuration +
                        this.walkedDistanceTemp
                );
                this._updatePosition();
            }

            if (!this.isPaused && !this.finished) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * 更新位置
     */
    _updatePosition(isManual = false) {
        if (this.isPaused && !isManual) return;

        const distance = this.distance;
        this._updateTrackIndex();
        this._updateMarkerPosition();
        this._updateLines();
        this._updateDecorator();
        this._updateMarkerRotation();
        this._updateProgress();
        this._checkCompletion();
    }

    /**
     * 更新轨迹索引
     */
    _updateTrackIndex() {
        this.trackIndex = this.distanceSlice.findIndex((item, index, arr) => {
            return (
                this.walkedDistance >= item &&
                this.walkedDistance < (arr[index + 1] ?? Infinity)
            );
        });
    }

    /**
     * 更新标记位置
     */
    _updateMarkerPosition() {
        const [lng, lat] = turf.along(this.track, this.walkedDistance).geometry
            .coordinates;
        this.markerPoint = [lat, lng];

        if (this.options.panTo) {
            this.map.panTo(this.markerPoint, { animate: false });
        }

        this.marker?.setLatLng(this.markerPoint);
    }

    /**
     * 更新轨迹线
     */
    _updateLines() {
        const distance = this.distance;

        // 更新未经过的轨迹
        if (this.walkedDistance >= distance) {
            this.notPassedLine.setLatLngs([]);
        } else {
            const sliced = turf.lineSliceAlong(this.track, this.walkedDistance);
            this.notPassedLine.setLatLngs(
                sliced.geometry.coordinates.map(([lng, lat]) => [lat, lng])
            );
        }

        // 更新已经过的轨迹
        if (this.walkedDistance > 0) {
            const sliced = turf.lineSliceAlong(
                this.track,
                0,
                this.walkedDistance
            );
            this.passedLine.setLatLngs(
                sliced.geometry.coordinates.map(([lng, lat]) => [lat, lng])
            );
        } else {
            this.passedLine.setLatLngs([]);
        }
    }

    /**
     * 更新装饰器
     */
    _updateDecorator() {
        if (!this.options.showArrows || !this.polylineDecorator) return;

        this.polylineDecorator.setPaths([
            ...this.passedLine.getLatLngs(),
            ...this.notPassedLine.getLatLngs(),
        ]);
    }

    /**
     * 更新标记旋转角度
     */
    _updateMarkerRotation() {
        if (
            !this.options.markerRotation ||
            !this.marker ||
            this.walkedDistance >= this.distance
        ) {
            return;
        }

        const nextIndex = this.trackIndex + 1;
        if (nextIndex < this.track.geometry.coordinates.length) {
            const currentPoint = turf.along(this.track, this.walkedDistance)
                .geometry.coordinates;
            const nextPoint = this.track.geometry.coordinates[nextIndex];
            const bearing = turf.bearing(
                turf.point(currentPoint),
                turf.point(nextPoint)
            );

            this.marker.setRotationAngle(
                bearing / 2 + this.options.markerRotationOffset / 2
            );
        }
    }

    /**
     * 更新播放进度
     */
    _updateProgress() {
        this.options.progress = Math.min(
            1,
            this.walkedDistance / this.distance
        );
        this._emit(
            "progress",
            this.options.progress,
            L.latLng(...this.markerPoint),
            this.trackIndex
        );
    }

    /**
     * 检查是否完成
     */
    _checkCompletion() {
        if (this.walkedDistance >= this.distance) {
            this.walkedDistance = this.distance;
            this.finished = true;
            this._setFinalMarkerRotation();
            this._emit("finished");
        }
    }

    /**
     * 设置最终标记旋转角度
     */
    _setFinalMarkerRotation() {
        if (!this.options.markerRotation || !this.marker) return;

        const coordinates = this.track.geometry.coordinates;
        const bearing = turf.bearing(
            turf.point(coordinates.at(-2)),
            turf.point(coordinates.at(-1))
        );
        this.marker.setRotationAngle(
            bearing / 2 + this.options.markerRotationOffset / 2
        );
    }
    /**
     * 设置速度动作
     */
    _setSpeedAction(speed) {
        this.options.speed = speed;
        this.walkedDistanceTemp = this.walkedDistance;
        this.startTimestamp = 0;
    }

    /**
     * 设置播放速度
     */
    async setSpeed(speed, wait = 20) {
        if (wait) {
            clearTimeout(this.setSpeedTimeout);
            await new Promise((resolve) => {
                this.setSpeedTimeout = setTimeout(resolve, wait);
            });
        }
        this._setSpeedAction(speed);
        return this;
    }

    /**
     * 设置播放进度
     */
    setProgress(progress) {
        if (!this.addedToMap) return this;

        const isSameProgress =
            (this.options.progress === 1 && progress === 1) ||
            (this.options.progress === 0 && progress === 0);

        if (isSameProgress) return this;

        this.options.progress = progress;
        this.walkedDistanceTemp = this.distance * progress;
        this.startTimestamp = 0;

        // 处理暂停和完成状态
        if (this.isPaused || this.finished) {
            this.walkedDistance = this.walkedDistanceTemp;
            if (this.finished) {
                this.finished = false;
                this.isPaused = false;
                this._startAnimation();
            } else {
                this._updatePosition(true);
            }
        }

        return this;
    }
    /**
     * 注册事件监听器
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            console.warn(`Unknown event: ${eventName}`);
            return this;
        }

        this.events[eventName].push(callback);
        return this;
    }

    /**
     * 移除事件监听器
     */
    off(eventName, callback) {
        if (!this.events[eventName]) {
            console.warn(`Unknown event: ${eventName}`);
            return this;
        }

        if (!callback) {
            this.events[eventName] = [];
        } else {
            this.events[eventName] = this.events[eventName].filter(
                (item) => item !== callback
            );
        }

        return this;
    }

    /**
     * 触发事件
     */
    _emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((callback) => callback(...args));
        }
    }

    /**
     * 更新轨迹线样式
     */
    updateLineStyle(styleOptions = {}) {
        if (!this.addedToMap) return this;

        const {
            passedLineColor,
            notPassedLineColor,
            passedLineWeight,
            notPassedLineWeight,
            passedLineOpacity,
            notPassedLineOpacity,
        } = styleOptions;

        if (passedLineColor !== undefined) {
            this.options.passedLineColor = passedLineColor;
            this.passedLine.setStyle({ color: passedLineColor });
        }

        if (notPassedLineColor !== undefined) {
            this.options.notPassedLineColor = notPassedLineColor;
            this.notPassedLine.setStyle({ color: notPassedLineColor });
        }

        if (passedLineWeight !== undefined) {
            this.options.passedLineWeight = passedLineWeight;
            this.passedLine.setStyle({ weight: passedLineWeight });
        }

        if (notPassedLineWeight !== undefined) {
            this.options.notPassedLineWeight = notPassedLineWeight;
            this.notPassedLine.setStyle({ weight: notPassedLineWeight });
        }

        if (passedLineOpacity !== undefined) {
            this.options.passedLineOpacity = passedLineOpacity;
            this.passedLine.setStyle({ opacity: passedLineOpacity });
        }

        if (notPassedLineOpacity !== undefined) {
            this.options.notPassedLineOpacity = notPassedLineOpacity;
            this.notPassedLine.setStyle({ opacity: notPassedLineOpacity });
        }

        return this;
    }

    /**
     * 更新箭头样式
     */
    updateArrowStyle(arrowOptions = {}) {
        if (!this.addedToMap) return this;

        const { color, size, opacity, show } = arrowOptions;

        if (show !== undefined) {
            this.options.showArrows = show;
            if (show && !this.polylineDecorator) {
                this._createDecorator();
            } else if (!show && this.polylineDecorator) {
                this.polylineDecorator.remove();
                this.polylineDecorator = null;
            }
        }

        if (
            this.polylineDecorator &&
            (color !== undefined || size !== undefined || opacity !== undefined)
        ) {
            if (color !== undefined) {
                this.options.arrowColor = color;
            }
            if (size !== undefined) {
                this.options.arrowSize = size;
            }
            if (opacity !== undefined) {
                this.options.arrowOpacity = opacity;
            }

            // 重新创建装饰器以应用新样式
            this.polylineDecorator.remove();
            this.options.polylineDecoratorOptions =
                this._getDefaultDecoratorOptions(this.options);
            this._createDecorator();
        }

        return this;
    }

    /**
     * 显示箭头
     */
    showArrows() {
        return this.updateArrowStyle({ show: true });
    }

    /**
     * 隐藏箭头
     */
    hideArrows() {
        return this.updateArrowStyle({ show: false });
    }

    /**
     * 获取当前状态
     */
    getState() {
        return {
            progress: this.options.progress,
            isPaused: this.isPaused,
            finished: this.finished,
            speed: this.options.speed,
            distance: this.distance,
            walkedDistance: this.walkedDistance,
            currentPosition: this.markerPoint
                ? L.latLng(...this.markerPoint)
                : null,
            trackIndex: this.trackIndex,
        };
    }
};
