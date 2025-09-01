var W = (t, i, e) => new Promise((s, n) => {
  var h = (l) => {
    try {
      u(e.next(l));
    } catch (f) {
      n(f);
    }
  }, c = (l) => {
    try {
      u(e.throw(l));
    } catch (f) {
      n(f);
    }
  }, u = (l) => l.done ? s(l.value) : Promise.resolve(l.value).then(h, c);
  u((e = e.apply(t, i)).next());
});
import b from "leaflet";
var k = 63710088e-1, Z = {
  centimeters: k * 100,
  centimetres: k * 100,
  degrees: k / 111325,
  feet: k * 3.28084,
  inches: k * 39.37,
  kilometers: k / 1e3,
  kilometres: k / 1e3,
  meters: k,
  metres: k,
  miles: k / 1609.344,
  millimeters: k * 1e3,
  millimetres: k * 1e3,
  nauticalmiles: k / 1852,
  radians: 1,
  yards: k * 1.0936
};
function z(t, i, e) {
  e === void 0 && (e = {});
  var s = { type: "Feature" };
  return (e.id === 0 || e.id) && (s.id = e.id), e.bbox && (s.bbox = e.bbox), s.properties = i || {}, s.geometry = t, s;
}
function A(t, i, e) {
  if (e === void 0 && (e = {}), !t)
    throw new Error("coordinates is required");
  if (!Array.isArray(t))
    throw new Error("coordinates must be an Array");
  if (t.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!H(t[0]) || !H(t[1]))
    throw new Error("coordinates must contain numbers");
  var s = {
    type: "Point",
    coordinates: t
  };
  return z(s, i, e);
}
function O(t, i, e) {
  if (e === void 0 && (e = {}), t.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  var s = {
    type: "LineString",
    coordinates: t
  };
  return z(s, i, e);
}
function Q(t, i) {
  i === void 0 && (i = "kilometers");
  var e = Z[i];
  if (!e)
    throw new Error(i + " units is invalid");
  return t * e;
}
function X(t, i) {
  i === void 0 && (i = "kilometers");
  var e = Z[i];
  if (!e)
    throw new Error(i + " units is invalid");
  return t / e;
}
function G(t) {
  var i = t % (2 * Math.PI);
  return i * 180 / Math.PI;
}
function M(t) {
  var i = t % 360;
  return i * Math.PI / 180;
}
function H(t) {
  return !isNaN(t) && t !== null && !Array.isArray(t);
}
function Y(t) {
  return !!t && t.constructor === Object;
}
function J(t, i, e) {
  if (t !== null)
    for (var s, n, h, c, u, l, f, v = 0, g = 0, w, o = t.type, r = o === "FeatureCollection", a = o === "Feature", d = r ? t.features.length : 1, p = 0; p < d; p++) {
      f = r ? t.features[p].geometry : a ? t.geometry : t, w = f ? f.type === "GeometryCollection" : !1, u = w ? f.geometries.length : 1;
      for (var y = 0; y < u; y++) {
        var m = 0, P = 0;
        if (c = w ? f.geometries[y] : f, c !== null) {
          l = c.coordinates;
          var _ = c.type;
          switch (v = 0, _) {
            case null:
              break;
            case "Point":
              if (i(
                l,
                g,
                p,
                m,
                P
              ) === !1)
                return !1;
              g++, m++;
              break;
            case "LineString":
            case "MultiPoint":
              for (s = 0; s < l.length; s++) {
                if (i(
                  l[s],
                  g,
                  p,
                  m,
                  P
                ) === !1)
                  return !1;
                g++, _ === "MultiPoint" && m++;
              }
              _ === "LineString" && m++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (s = 0; s < l.length; s++) {
                for (n = 0; n < l[s].length - v; n++) {
                  if (i(
                    l[s][n],
                    g,
                    p,
                    m,
                    P
                  ) === !1)
                    return !1;
                  g++;
                }
                _ === "MultiLineString" && m++, _ === "Polygon" && P++;
              }
              _ === "Polygon" && m++;
              break;
            case "MultiPolygon":
              for (s = 0; s < l.length; s++) {
                for (P = 0, n = 0; n < l[s].length; n++) {
                  for (h = 0; h < l[s][n].length - v; h++) {
                    if (i(
                      l[s][n][h],
                      g,
                      p,
                      m,
                      P
                    ) === !1)
                      return !1;
                    g++;
                  }
                  P++;
                }
                m++;
              }
              break;
            case "GeometryCollection":
              for (s = 0; s < c.geometries.length; s++)
                if (J(c.geometries[s], i) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function j(t, i) {
  var e, s, n, h, c, u, l, f, v, g, w = 0, o = t.type === "FeatureCollection", r = t.type === "Feature", a = o ? t.features.length : 1;
  for (e = 0; e < a; e++) {
    for (u = o ? t.features[e].geometry : r ? t.geometry : t, f = o ? t.features[e].properties : r ? t.properties : {}, v = o ? t.features[e].bbox : r ? t.bbox : void 0, g = o ? t.features[e].id : r ? t.id : void 0, l = u ? u.type === "GeometryCollection" : !1, c = l ? u.geometries.length : 1, n = 0; n < c; n++) {
      if (h = l ? u.geometries[n] : u, h === null) {
        if (i(
          null,
          w,
          f,
          v,
          g
        ) === !1)
          return !1;
        continue;
      }
      switch (h.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (i(
            h,
            w,
            f,
            v,
            g
          ) === !1)
            return !1;
          break;
        }
        case "GeometryCollection": {
          for (s = 0; s < h.geometries.length; s++)
            if (i(
              h.geometries[s],
              w,
              f,
              v,
              g
            ) === !1)
              return !1;
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    w++;
  }
}
function $(t, i) {
  j(t, function(e, s, n, h, c) {
    var u = e === null ? null : e.type;
    switch (u) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        return i(
          z(e, n, { bbox: h, id: c }),
          s,
          0
        ) === !1 ? !1 : void 0;
    }
    var l;
    switch (u) {
      case "MultiPoint":
        l = "Point";
        break;
      case "MultiLineString":
        l = "LineString";
        break;
      case "MultiPolygon":
        l = "Polygon";
        break;
    }
    for (var f = 0; f < e.coordinates.length; f++) {
      var v = e.coordinates[f], g = {
        type: l,
        coordinates: v
      };
      if (i(z(g, n), s, f) === !1)
        return !1;
    }
  });
}
function tt(t, i) {
  $(t, function(e, s, n) {
    var h = 0;
    if (e.geometry) {
      var c = e.geometry.type;
      if (!(c === "Point" || c === "MultiPoint")) {
        var u, l = 0, f = 0, v = 0;
        if (J(
          e,
          function(g, w, o, r, a) {
            if (u === void 0 || s > l || r > f || a > v) {
              u = g, l = s, f = r, v = a, h = 0;
              return;
            }
            var d = O(
              [u, g],
              e.properties
            );
            if (i(
              d,
              s,
              n,
              a,
              h
            ) === !1)
              return !1;
            h++, u = g;
          }
        ) === !1)
          return !1;
      }
    }
  });
}
function et(t, i, e) {
  var s = e, n = !1;
  return tt(
    t,
    function(h, c, u, l, f) {
      n === !1 && e === void 0 ? s = h : s = i(
        s,
        h,
        c,
        u,
        l,
        f
      ), n = !0;
    }
  ), s;
}
function x(t) {
  if (!t)
    throw new Error("coord is required");
  if (!Array.isArray(t)) {
    if (t.type === "Feature" && t.geometry !== null && t.geometry.type === "Point")
      return t.geometry.coordinates;
    if (t.type === "Point")
      return t.coordinates;
  }
  if (Array.isArray(t) && t.length >= 2 && !Array.isArray(t[0]) && !Array.isArray(t[1]))
    return t;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function it(t) {
  return t.type === "Feature" ? t.geometry : t;
}
var st = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function U(t, i, e) {
  e === void 0 && (e = {});
  var s = x(t), n = x(i), h = M(n[1] - s[1]), c = M(n[0] - s[0]), u = M(s[1]), l = M(n[1]), f = Math.pow(Math.sin(h / 2), 2) + Math.pow(Math.sin(c / 2), 2) * Math.cos(u) * Math.cos(l);
  return Q(2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f)), e.units);
}
function I(t, i, e, s) {
  s === void 0 && (s = {});
  var n = x(t), h = M(n[0]), c = M(n[1]), u = M(e), l = X(i, s.units), f = Math.asin(Math.sin(c) * Math.cos(l) + Math.cos(c) * Math.sin(l) * Math.cos(u)), v = h + Math.atan2(Math.sin(u) * Math.sin(l) * Math.cos(c), Math.cos(l) - Math.sin(c) * Math.sin(f)), g = G(v), w = G(f);
  return A([g, w], s.properties);
}
function D(t, i, e) {
  if (e === void 0 && (e = {}), e.final === !0)
    return rt(t, i);
  var s = x(t), n = x(i), h = M(s[0]), c = M(n[0]), u = M(s[1]), l = M(n[1]), f = Math.sin(c - h) * Math.cos(l), v = Math.cos(u) * Math.sin(l) - Math.sin(u) * Math.cos(l) * Math.cos(c - h);
  return G(Math.atan2(f, v));
}
function rt(t, i) {
  var e = D(i, t);
  return e = (e + 180) % 360, e;
}
function q(t, i, e) {
  e === void 0 && (e = {});
  for (var s = it(t), n = s.coordinates, h = 0, c = 0; c < n.length && !(i >= h && c === n.length - 1); c++)
    if (h >= i) {
      var u = i - h;
      if (u) {
        var l = D(n[c], n[c - 1]) - 180, f = I(n[c], u, l, e);
        return f;
      } else
        return A(n[c]);
    } else
      h += U(n[c], n[c + 1], e);
  return A(n[n.length - 1]);
}
function N(t, i) {
  return i === void 0 && (i = {}), et(t, function(e, s) {
    var n = s.geometry.coordinates;
    return e + U(n[0], n[1], i);
  }, 0);
}
function V(t, i, e, s) {
  if (s = s || {}, !Y(s)) throw new Error("options is invalid");
  var n, h = [];
  if (t.type === "Feature") n = t.geometry.coordinates;
  else if (t.type === "LineString") n = t.coordinates;
  else throw new Error("input must be a LineString Feature or Geometry");
  for (var c = n.length, u = 0, l, f, v, g = 0; g < n.length && !(i >= u && g === n.length - 1); g++) {
    if (u > i && h.length === 0) {
      if (l = i - u, !l)
        return h.push(n[g]), O(h);
      f = D(n[g], n[g - 1]) - 180, v = I(n[g], l, f, s), h.push(v.geometry.coordinates);
    }
    if (u >= e)
      return l = e - u, l ? (f = D(n[g], n[g - 1]) - 180, v = I(n[g], l, f, s), h.push(v.geometry.coordinates), O(h)) : (h.push(n[g]), O(h));
    if (u >= i && h.push(n[g]), g === n.length - 1)
      return O(h);
    u += U(n[g], n[g + 1], s);
  }
  if (u < i && n.length === c)
    throw new Error("Start position is beyond line");
  var w = n[n.length - 1];
  return O([w, w]);
}
(function(t, i) {
  (function(e, s) {
    s(b);
  })(st, function(e) {
    e = e && e.hasOwnProperty("default") ? e.default : e;
    function s(o, r) {
      var a = r.x - o.x, d = r.y - o.y;
      return Math.sqrt(a * a + d * d);
    }
    var n = function(r, a) {
      return (Math.atan2(a.y - r.y, a.x - r.x) * 180 / Math.PI + 90 + 360) % 360;
    }, h = function(r, a) {
      var d = r.value, p = r.isInPixels;
      return p ? d / a : d;
    };
    function c(o) {
      if (typeof o == "string" && o.indexOf("%") !== -1)
        return {
          value: parseFloat(o) / 100,
          isInPixels: !1
        };
      var r = o ? parseFloat(o) : 0;
      return {
        value: r,
        isInPixels: r > 0
      };
    }
    var u = function(r, a) {
      return r.x === a.x && r.y === a.y;
    };
    function l(o) {
      return o.reduce(function(r, a, d, p) {
        if (d > 0 && !u(a, p[d - 1])) {
          var y = p[d - 1], m = r.length > 0 ? r[r.length - 1].distB : 0, P = s(y, a);
          r.push({
            a: y,
            b: a,
            distA: m,
            distB: m + P,
            heading: n(y, a)
          });
        }
        return r;
      }, []);
    }
    function f(o, r) {
      var a = l(o), d = a.length;
      if (d === 0)
        return [];
      var p = a[d - 1].distB, y = h(r.offset, p), m = h(r.endOffset, p), P = h(r.repeat, p), _ = p * P, T = y > 0 ? p * y : 0, R = m > 0 ? p * m : 0, C = [], E = T;
      do
        C.push(E), E += _;
      while (_ > 0 && E < p - R);
      var F = 0, S = a[0];
      return C.map(function(B) {
        for (; B > S.distB && F < d - 1; )
          F++, S = a[F];
        var K = (B - S.distA) / (S.distB - S.distA);
        return {
          pt: v(S.a, S.b, K),
          heading: S.heading
        };
      });
    }
    function v(o, r, a) {
      return r.x !== o.x ? {
        x: o.x + a * (r.x - o.x),
        y: o.y + a * (r.y - o.y)
      } : {
        x: o.x,
        y: o.y + (r.y - o.y) * a
      };
    }
    (function() {
      var o = L.Marker.prototype._initIcon, r = L.Marker.prototype._setPos, a = L.DomUtil.TRANSFORM === "msTransform";
      L.Marker.addInitHook(function() {
        var d = this.options.icon && this.options.icon.options, p = d && this.options.icon.options.iconAnchor;
        p && (p = p[0] + "px " + p[1] + "px"), this.options.rotationOrigin = this.options.rotationOrigin || p || "center bottom", this.options.rotationAngle = this.options.rotationAngle || 0, this.on("drag", function(y) {
          y.target._applyRotation();
        });
      }), L.Marker.include({
        _initIcon: function() {
          o.call(this);
        },
        _setPos: function(d) {
          r.call(this, d), this._applyRotation();
        },
        _applyRotation: function() {
          this.options.rotationAngle && (this._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotationOrigin, a ? this._icon.style[L.DomUtil.TRANSFORM] = "rotate(" + this.options.rotationAngle + "deg)" : this._icon.style[L.DomUtil.TRANSFORM] += " rotateZ(" + this.options.rotationAngle + "deg)");
        },
        setRotationAngle: function(d) {
          return this.options.rotationAngle = d, this.update(), this;
        },
        setRotationOrigin: function(d) {
          return this.options.rotationOrigin = d, this.update(), this;
        }
      });
    })(), e.Symbol = e.Symbol || {}, e.Symbol.Dash = e.Class.extend({
      options: {
        pixelSize: 10,
        pathOptions: {}
      },
      initialize: function(r) {
        e.Util.setOptions(this, r), this.options.pathOptions.clickable = !1;
      },
      buildSymbol: function(r, a, d, p, y) {
        var m = this.options, P = Math.PI / 180;
        if (m.pixelSize <= 1)
          return e.polyline([r.latLng, r.latLng], m.pathOptions);
        var _ = d.project(r.latLng), T = -(r.heading - 90) * P, R = e.point(_.x + m.pixelSize * Math.cos(T + Math.PI) / 2, _.y + m.pixelSize * Math.sin(T) / 2), C = _.add(_.subtract(R));
        return e.polyline([d.unproject(R), d.unproject(C)], m.pathOptions);
      }
    }), e.Symbol.dash = function(o) {
      return new e.Symbol.Dash(o);
    }, e.Symbol.ArrowHead = e.Class.extend({
      options: {
        polygon: !0,
        pixelSize: 10,
        headAngle: 60,
        pathOptions: {
          stroke: !1,
          weight: 2
        }
      },
      initialize: function(r) {
        e.Util.setOptions(this, r), this.options.pathOptions.clickable = !1;
      },
      buildSymbol: function(r, a, d, p, y) {
        return this.options.polygon ? e.polygon(this._buildArrowPath(r, d), this.options.pathOptions) : e.polyline(this._buildArrowPath(r, d), this.options.pathOptions);
      },
      _buildArrowPath: function(r, a) {
        var d = Math.PI / 180, p = a.project(r.latLng), y = -(r.heading - 90) * d, m = this.options.headAngle / 2 * d, P = y + m, _ = y - m, T = e.point(p.x - this.options.pixelSize * Math.cos(P), p.y + this.options.pixelSize * Math.sin(P)), R = e.point(p.x - this.options.pixelSize * Math.cos(_), p.y + this.options.pixelSize * Math.sin(_));
        return [a.unproject(T), r.latLng, a.unproject(R)];
      }
    }), e.Symbol.arrowHead = function(o) {
      return new e.Symbol.ArrowHead(o);
    }, e.Symbol.Marker = e.Class.extend({
      options: {
        markerOptions: {},
        rotate: !1
      },
      initialize: function(r) {
        e.Util.setOptions(this, r), this.options.markerOptions.clickable = !1, this.options.markerOptions.draggable = !1;
      },
      buildSymbol: function(r, a, d, p, y) {
        return this.options.rotate && (this.options.markerOptions.rotationAngle = r.heading + (this.options.angleCorrection || 0)), e.marker(r.latLng, this.options.markerOptions);
      }
    }), e.Symbol.marker = function(o) {
      return new e.Symbol.Marker(o);
    };
    var g = function(r) {
      return r instanceof e.LatLng || Array.isArray(r) && r.length === 2 && typeof r[0] == "number";
    }, w = function(r) {
      return Array.isArray(r) && g(r[0]);
    };
    e.PolylineDecorator = e.FeatureGroup.extend({
      options: {
        patterns: []
      },
      initialize: function(r, a) {
        e.FeatureGroup.prototype.initialize.call(this), e.Util.setOptions(this, a), this._map = null, this._paths = this._initPaths(r), this._bounds = this._initBounds(), this._patterns = this._initPatterns(this.options.patterns);
      },
      /**
      * Deals with all the different cases. input can be one of these types:
      * array of LatLng, array of 2-number arrays, Polyline, Polygon,
      * array of one of the previous.
      */
      _initPaths: function(r, a) {
        var d = this;
        if (w(r)) {
          var p = a ? r.concat([r[0]]) : r;
          return [p];
        }
        return r instanceof e.Polyline ? this._initPaths(r.getLatLngs(), r instanceof e.Polygon) : Array.isArray(r) ? r.reduce(function(y, m) {
          return y.concat(d._initPaths(m, a));
        }, []) : [];
      },
      // parse pattern definitions and precompute some values
      _initPatterns: function(r) {
        return r.map(this._parsePatternDef);
      },
      /**
      * Changes the patterns used by this decorator
      * and redraws the new one.
      */
      setPatterns: function(r) {
        this.options.patterns = r, this._patterns = this._initPatterns(this.options.patterns), this.redraw();
      },
      /**
      * Changes the patterns used by this decorator
      * and redraws the new one.
      */
      setPaths: function(r) {
        this._paths = this._initPaths(r), this._bounds = this._initBounds(), this.redraw();
      },
      /**
      * Parse the pattern definition
      */
      _parsePatternDef: function(r, a) {
        return {
          symbolFactory: r.symbol,
          // Parse offset and repeat values, managing the two cases:
          // absolute (in pixels) or relative (in percentage of the polyline length)
          offset: c(r.offset),
          endOffset: c(r.endOffset),
          repeat: c(r.repeat)
        };
      },
      onAdd: function(r) {
        this._map = r, this._draw(), this._map.on("moveend", this.redraw, this);
      },
      onRemove: function(r) {
        this._map.off("moveend", this.redraw, this), this._map = null, e.FeatureGroup.prototype.onRemove.call(this, r);
      },
      /**
      * As real pattern bounds depends on map zoom and bounds,
      * we just compute the total bounds of all paths decorated by this instance.
      */
      _initBounds: function() {
        var r = this._paths.reduce(function(a, d) {
          return a.concat(d);
        }, []);
        return e.latLngBounds(r);
      },
      getBounds: function() {
        return this._bounds;
      },
      /**
      * Returns an array of ILayers object
      */
      _buildSymbols: function(r, a, d) {
        var p = this;
        return d.map(function(y, m) {
          return a.buildSymbol(y, r, p._map, m, d.length);
        });
      },
      /**
      * Compute pairs of LatLng and heading angle,
      * that define positions and directions of the symbols on the path
      */
      _getDirectionPoints: function(r, a) {
        var d = this;
        if (r.length < 2)
          return [];
        var p = r.map(function(y) {
          return d._map.project(y);
        });
        return f(p, a).map(function(y) {
          return {
            latLng: d._map.unproject(e.point(y.pt)),
            heading: y.heading
          };
        });
      },
      redraw: function() {
        this._map && (this.clearLayers(), this._draw());
      },
      /**
      * Returns all symbols for a given pattern as an array of FeatureGroup
      */
      _getPatternLayers: function(r) {
        var a = this, d = this._map.getBounds().pad(0.1);
        return this._paths.map(function(p) {
          var y = a._getDirectionPoints(p, r).filter(function(m) {
            return d.contains(m.latLng);
          });
          return e.featureGroup(a._buildSymbols(p, r.symbolFactory, y));
        });
      },
      /**
      * Draw all patterns
      */
      _draw: function() {
        var r = this;
        this._patterns.map(function(a) {
          return r._getPatternLayers(a);
        }).forEach(function(a) {
          r.addLayer(e.featureGroup(a));
        });
      }
    }), e.polylineDecorator = function(o, r) {
      return new e.PolylineDecorator(o, r);
    };
  });
})();
(function() {
  var t = L.Marker.prototype._initIcon, i = L.Marker.prototype._setPos, e = L.DomUtil.TRANSFORM === "msTransform";
  L.Marker.addInitHook(function() {
    var s = this.options.icon && this.options.icon.options, n = s && this.options.icon.options.iconAnchor;
    n && (n = n[0] + "px " + n[1] + "px"), this.options.rotationOrigin = this.options.rotationOrigin || n || "center bottom", this.options.rotationAngle = this.options.rotationAngle || 0, this.on("drag", function(h) {
      h.target._applyRotation();
    });
  }), L.Marker.include({
    _initIcon: function() {
      t.call(this);
    },
    _setPos: function(s) {
      i.call(this, s), this._applyRotation();
    },
    _applyRotation: function() {
      this.options.rotationAngle && (this._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotationOrigin, e ? this._icon.style[L.DomUtil.TRANSFORM] = "rotate(" + this.options.rotationAngle + "deg)" : this._icon.style[L.DomUtil.TRANSFORM] += " rotateZ(" + this.options.rotationAngle + "deg)");
    },
    setRotationAngle: function(s) {
      return this.options.rotationAngle = s, this.update(), this;
    },
    setRotationOrigin: function(s) {
      return this.options.rotationOrigin = s, this.update(), this;
    }
  });
})();
b.TrackPlayer = class {
  constructor(t, i = {}) {
    this._initializeTrack(t), this.options = this._mergeOptions(i), this.initProgress = i.progress, this.addedToMap = !1, this.isPaused = !0, this.finished = !1, this.walkedDistance = 0, this.walkedDistanceTemp = 0, this.trackIndex = 0, this.startTimestamp = 0, this.pauseTimestamp = 0, this.events = {
      start: [],
      pause: [],
      finished: [],
      progress: []
    };
  }
  /**
   * 初始化轨迹数据
   */
  _initializeTrack(t) {
    const i = b.polyline(t)._latlngs;
    this.track = O(
      i.map(({ lng: e, lat: s }) => [e, s])
    ), this.distanceSlice = this._calculateDistanceSlices(), this.distance = N(this.track);
  }
  /**
   * 计算每个点的累积距离
   */
  _calculateDistanceSlices() {
    const t = [0], i = this.track.geometry.coordinates;
    for (let e = 1; e < i.length; e++) {
      const s = O(i.slice(0, e + 1));
      t.push(N(s));
    }
    return t;
  }
  /**
   * 合并配置选项
   */
  _mergeOptions(t) {
    var i, e, s, n, h, c, u, l, f, v, g, w, o, r, a, d, p, y, m, P;
    return {
      speed: (i = t.speed) != null ? i : 600,
      weight: (e = t.weight) != null ? e : 5,
      passedLineWeight: (n = t.passedLineWeight) != null ? n : ((s = t.weight) != null ? s : 5) + 1,
      notPassedLineWeight: (c = (h = t.notPassedLineWeight) != null ? h : t.weight) != null ? c : 5,
      markerIcon: t.markerIcon,
      showArrows: (u = t.showArrows) != null ? u : !0,
      arrowColor: (l = t.arrowColor) != null ? l : "#fff",
      arrowSize: (f = t.arrowSize) != null ? f : 5,
      arrowOpacity: (v = t.arrowOpacity) != null ? v : 1,
      polylineDecoratorOptions: (g = t.polylineDecoratorOptions) != null ? g : this._getDefaultDecoratorOptions(t),
      passedLineColor: (w = t.passedLineColor) != null ? w : "#0000ff",
      notPassedLineColor: (o = t.notPassedLineColor) != null ? o : "#ff0000",
      passedLineOpacity: (r = t.passedLineOpacity) != null ? r : 1,
      notPassedLineOpacity: (a = t.notPassedLineOpacity) != null ? a : 1,
      panTo: (d = t.panTo) != null ? d : !0,
      markerRotationOrigin: (p = t.markerRotationOrigin) != null ? p : "center",
      markerRotationOffset: (y = t.markerRotationOffset) != null ? y : 0,
      markerRotation: (m = t.markerRotation) != null ? m : !0,
      progress: (P = t.progress) != null ? P : 0
    };
  }
  /**
   * 获取默认装饰器选项
   */
  _getDefaultDecoratorOptions(t = {}) {
    var s, n, h;
    const i = (s = t.arrowSize) != null ? s : 5, e = Math.max(1, Math.min(3, Math.ceil(i / 3)));
    return {
      patterns: [
        {
          offset: 30,
          repeat: 60,
          symbol: b.Symbol.arrowHead({
            pixelSize: i,
            headAngle: 60,
            polygon: !1,
            pathOptions: {
              stroke: !0,
              weight: e,
              color: (n = t.arrowColor) != null ? n : "#fff",
              opacity: (h = t.arrowOpacity) != null ? h : 1
            }
          })
        }
      ]
    };
  }
  /**
   * 添加到地图
   */
  addTo(t) {
    return this.addedToMap ? this : (this.map = t, this.addedToMap = !0, this._createMarker(), this._createLines(), this._createDecorator(), this.initProgress && this.setProgress(this.initProgress), this);
  }
  /**
   * 创建标记点
   */
  _createMarker() {
    if (!this.options.markerIcon) return;
    const [t, i] = this.track.geometry.coordinates[0];
    this.marker = b.marker([i, t], {
      icon: this.options.markerIcon
    }).addTo(this.map), this.options.markerRotation && this._setInitialMarkerRotation();
  }
  /**
   * 设置初始标记旋转角度
   */
  _setInitialMarkerRotation() {
    const t = this.track.geometry.coordinates, i = D(t[0], t[1]);
    this.marker.setRotationAngle(
      i / 2 + this.options.markerRotationOffset / 2
    ), this.marker.setRotationOrigin(this.options.markerRotationOrigin);
  }
  /**
   * 创建轨迹线
   */
  _createLines() {
    const t = this.track.geometry.coordinates.map(([i, e]) => [
      e,
      i
    ]);
    this.notPassedLine = b.polyline(t, {
      weight: this.options.notPassedLineWeight,
      color: this.options.notPassedLineColor,
      opacity: this.options.notPassedLineOpacity
    }).addTo(this.map), this.passedLine = b.polyline([], {
      weight: this.options.passedLineWeight,
      color: this.options.passedLineColor,
      opacity: this.options.passedLineOpacity
    }).addTo(this.map);
  }
  /**
   * 创建装饰器
   */
  _createDecorator() {
    if (!this.options.showArrows) return;
    const t = this.track.geometry.coordinates.map(([i, e]) => [
      e,
      i
    ]);
    this.polylineDecorator = b.polylineDecorator(
      t,
      this.options.polylineDecoratorOptions
    ).addTo(this.map);
  }
  /**
   * 从地图移除
   */
  remove() {
    return this.addedToMap ? (this.addedToMap = !1, this._cleanup(), this._resetState(), this) : this;
  }
  /**
   * 清理地图元素
   */
  _cleanup() {
    var t, i, e, s;
    (t = this.polylineDecorator) == null || t.remove(), (i = this.notPassedLine) == null || i.remove(), (e = this.passedLine) == null || e.remove(), (s = this.marker) == null || s.remove(), this.polylineDecorator = null, this.notPassedLine = null, this.passedLine = null, this.marker = null;
  }
  /**
   * 重置状态
   */
  _resetState() {
    this.finished = !1, this.startTimestamp = 0, this.pauseTimestamp = 0, this.walkedDistanceTemp = 0, this.walkedDistance = 0, this.trackIndex = 0, this.isPaused = !0, this.options.progress = this.initProgress;
  }
  /**
   * 开始播放
   */
  start() {
    return !this.isPaused && !this.finished || !this.addedToMap ? this : (this._prepareStart(), this.isPaused = !1, this.finished = !1, this._adjustTimestamp(), this._startAnimation(), this._emit("start"), this.initProgress && this.setProgress(this.initProgress), this);
  }
  /**
   * 准备开始播放
   */
  _prepareStart() {
    (this.options.progress === 0 || this.options.progress === 1) && (this.startTimestamp = 0, this.pauseTimestamp = 0, this.walkedDistanceTemp = 0, this.walkedDistance = 0);
  }
  /**
   * 调整时间戳
   */
  _adjustTimestamp() {
    this.pauseTimestamp && this.startTimestamp && (this.startTimestamp += Date.now() - this.pauseTimestamp);
  }
  /**
   * 暂停播放
   */
  pause() {
    return this.isPaused || this.finished ? this : (this.pauseTimestamp = Date.now(), this.isPaused = !0, this._emit("pause"), this);
  }
  /**
   * 开始动画循环
   */
  _startAnimation() {
    const t = this.distance, i = t / this.options.speed * 3600 * 1e3, e = (s) => {
      if (s && this.addedToMap) {
        this.startTimestamp || (this.startTimestamp = s);
        const n = s - this.startTimestamp;
        this.walkedDistance = Math.min(
          t,
          t * n / i + this.walkedDistanceTemp
        ), this._updatePosition();
      }
      !this.isPaused && !this.finished && requestAnimationFrame(e);
    };
    requestAnimationFrame(e);
  }
  /**
   * 更新位置
   */
  _updatePosition(t = !1) {
    this.isPaused && !t || (this.distance, this._updateTrackIndex(), this._updateMarkerPosition(), this._updateLines(), this._updateDecorator(), this._updateMarkerRotation(), this._updateProgress(), this._checkCompletion());
  }
  /**
   * 更新轨迹索引
   */
  _updateTrackIndex() {
    this.trackIndex = this.distanceSlice.findIndex((t, i, e) => {
      var s;
      return this.walkedDistance >= t && this.walkedDistance < ((s = e[i + 1]) != null ? s : 1 / 0);
    });
  }
  /**
   * 更新标记位置
   */
  _updateMarkerPosition() {
    var e;
    const [t, i] = q(this.track, this.walkedDistance).geometry.coordinates;
    this.markerPoint = [i, t], this.options.panTo && this.map.panTo(this.markerPoint, { animate: !1 }), (e = this.marker) == null || e.setLatLng(this.markerPoint);
  }
  /**
   * 更新轨迹线
   */
  _updateLines() {
    const t = this.distance;
    if (this.walkedDistance >= t)
      this.notPassedLine.setLatLngs([]);
    else {
      const i = V(this.track, this.walkedDistance);
      this.notPassedLine.setLatLngs(
        i.geometry.coordinates.map(([e, s]) => [s, e])
      );
    }
    if (this.walkedDistance > 0) {
      const i = V(
        this.track,
        0,
        this.walkedDistance
      );
      this.passedLine.setLatLngs(
        i.geometry.coordinates.map(([e, s]) => [s, e])
      );
    } else
      this.passedLine.setLatLngs([]);
  }
  /**
   * 更新装饰器
   */
  _updateDecorator() {
    !this.options.showArrows || !this.polylineDecorator || this.polylineDecorator.setPaths([
      ...this.passedLine.getLatLngs(),
      ...this.notPassedLine.getLatLngs()
    ]);
  }
  /**
   * 更新标记旋转角度
   */
  _updateMarkerRotation() {
    if (!this.options.markerRotation || !this.marker || this.walkedDistance >= this.distance)
      return;
    const t = this.trackIndex + 1;
    if (t < this.track.geometry.coordinates.length) {
      const i = q(this.track, this.walkedDistance).geometry.coordinates, e = this.track.geometry.coordinates[t], s = D(
        A(i),
        A(e)
      );
      this.marker.setRotationAngle(
        s / 2 + this.options.markerRotationOffset / 2
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
    ), this._emit(
      "progress",
      this.options.progress,
      b.latLng(...this.markerPoint),
      this.trackIndex
    );
  }
  /**
   * 检查是否完成
   */
  _checkCompletion() {
    this.walkedDistance >= this.distance && (this.walkedDistance = this.distance, this.finished = !0, this._setFinalMarkerRotation(), this._emit("finished"));
  }
  /**
   * 设置最终标记旋转角度
   */
  _setFinalMarkerRotation() {
    if (!this.options.markerRotation || !this.marker) return;
    const t = this.track.geometry.coordinates, i = D(
      A(t.at(-2)),
      A(t.at(-1))
    );
    this.marker.setRotationAngle(
      i / 2 + this.options.markerRotationOffset / 2
    );
  }
  /**
   * 设置速度动作
   */
  _setSpeedAction(t) {
    this.options.speed = t, this.walkedDistanceTemp = this.walkedDistance, this.startTimestamp = 0;
  }
  /**
   * 设置播放速度
   */
  setSpeed(t, i = 20) {
    return W(this, null, function* () {
      return i && (clearTimeout(this.setSpeedTimeout), yield new Promise((e) => {
        this.setSpeedTimeout = setTimeout(e, i);
      })), this._setSpeedAction(t), this;
    });
  }
  /**
   * 设置播放进度
   */
  setProgress(t) {
    return this.addedToMap ? this.options.progress === 1 && t === 1 || this.options.progress === 0 && t === 0 ? this : (this.options.progress = t, this.walkedDistanceTemp = this.distance * t, this.startTimestamp = 0, (this.isPaused || this.finished) && (this.walkedDistance = this.walkedDistanceTemp, this.finished ? (this.finished = !1, this.isPaused = !1, this._startAnimation()) : this._updatePosition(!0)), this) : this;
  }
  /**
   * 注册事件监听器
   */
  on(t, i) {
    return this.events[t] ? (this.events[t].push(i), this) : (console.warn(`Unknown event: ${t}`), this);
  }
  /**
   * 移除事件监听器
   */
  off(t, i) {
    return this.events[t] ? (i ? this.events[t] = this.events[t].filter(
      (e) => e !== i
    ) : this.events[t] = [], this) : (console.warn(`Unknown event: ${t}`), this);
  }
  /**
   * 触发事件
   */
  _emit(t, ...i) {
    this.events[t] && this.events[t].forEach((e) => e(...i));
  }
  /**
   * 更新轨迹线样式
   */
  updateLineStyle(t = {}) {
    if (!this.addedToMap) return this;
    const {
      passedLineColor: i,
      notPassedLineColor: e,
      passedLineWeight: s,
      notPassedLineWeight: n,
      passedLineOpacity: h,
      notPassedLineOpacity: c
    } = t;
    return i !== void 0 && (this.options.passedLineColor = i, this.passedLine.setStyle({ color: i })), e !== void 0 && (this.options.notPassedLineColor = e, this.notPassedLine.setStyle({ color: e })), s !== void 0 && (this.options.passedLineWeight = s, this.passedLine.setStyle({ weight: s })), n !== void 0 && (this.options.notPassedLineWeight = n, this.notPassedLine.setStyle({ weight: n })), h !== void 0 && (this.options.passedLineOpacity = h, this.passedLine.setStyle({ opacity: h })), c !== void 0 && (this.options.notPassedLineOpacity = c, this.notPassedLine.setStyle({ opacity: c })), this;
  }
  /**
   * 更新箭头样式
   */
  updateArrowStyle(t = {}) {
    if (!this.addedToMap) return this;
    const { color: i, size: e, opacity: s, show: n } = t;
    return n !== void 0 && (this.options.showArrows = n, n && !this.polylineDecorator ? this._createDecorator() : !n && this.polylineDecorator && (this.polylineDecorator.remove(), this.polylineDecorator = null)), this.polylineDecorator && (i !== void 0 || e !== void 0 || s !== void 0) && (i !== void 0 && (this.options.arrowColor = i), e !== void 0 && (this.options.arrowSize = e), s !== void 0 && (this.options.arrowOpacity = s), this.polylineDecorator.remove(), this.options.polylineDecoratorOptions = this._getDefaultDecoratorOptions(this.options), this._createDecorator()), this;
  }
  /**
   * 显示箭头
   */
  showArrows() {
    return this.updateArrowStyle({ show: !0 });
  }
  /**
   * 隐藏箭头
   */
  hideArrows() {
    return this.updateArrowStyle({ show: !1 });
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
      currentPosition: this.markerPoint ? b.latLng(...this.markerPoint) : null,
      trackIndex: this.trackIndex
    };
  }
};
