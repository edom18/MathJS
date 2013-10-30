(function (win, doc, exports) {

    'use strict';

    var sqrt = Math.sqrt;

    /**
     * vec4 class
     * @constructor
     * @class
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     * @param {number} w Component of w.
     */
    function vec4(x, y, z, w) {
        return vec4.create(x, y, z, w);
    }

    ///////////////////////////////////////////////////////////////////

    Object.defineProperty(vec4, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, 0, 1); }
    });

    Object.defineProperty(vec4, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 1, 0, 1); }
    });

    Object.defineProperty(vec4, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, -1, 0, 1); }
    });

    Object.defineProperty(vec4, 'forward', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, 1, 1); }
    });

    Object.defineProperty(vec4, 'back', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(0, 0, -1, 1); }
    });

    Object.defineProperty(vec4, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(1, 0, 0, 1); }
    });

    Object.defineProperty(vec4, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec4(-1, 0, 0, 1); }
    });

    ///////////////////////////////////////////////////////////////////

    /**
     * Check to equal values.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec4.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],
            v1w = v1[3],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2],
            v2w = v2[3];

        return (v1x === v2x) && (v1y === v2y) && (v1z === v2z) && (v1w === v2w);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x
     * @param {?number} y
     * @param {?number} z
     * @param {?number} w
     */
    vec4.create = function(x, y, z, w) {

        var elements = [],
            ret;

        if (Array.isArray(x)) {
            elements = new Float32Array(x);
        }
        else if (x === undefined) {
            elements = [0, 0, 0, 0];
        }
        else if (y === undefined) {
            elements = [x, x, x, x];
        }
        else if (z === undefined) {
            elements = [x, y, 0, 0];
        }
        else if (w === undefined) {
            elements = [x, y, z, 0];
        }
        else {
            elements = [x, y, z, w];
        }

        ret = new Float32Array(elements);

        Object.defineProperties(ret, {
            'x': {
                get: function () {
                    return this[0];
                },
                set: function (x) {
                    this[0] = x;
                }
            },
            'y': {
                get: function () {
                    return this[1];
                },
                set: function (y) {
                    this[1] = y;
                }
            },
            'z': {
                get: function () {
                    return this[2];
                },
                set: function (z) {
                    this[2] = z;
                }
            },
            'w': {
                get: function () {
                    return this[3];
                },
                set: function (w) {
                    this[3] = w;
                }
            },
            'xy': {
                get: function () {
                    return vec2(this[0], this[1]);
                },
                set: function (v) {
                    this[0] = v[0];
                    this[1] = v[1];
                }
            },
            'xyz': {
                get: function () {
                    return vec3(this[0], this[1], this[2]);
                },
                set: function (v) {
                    this[0] = v[0];
                    this[1] = v[1];
                    this[2] = v[2];
                }
            },
            'r': {
                get: function () {
                    return this[0];
                },
                set: function (r) {
                    this[0] = r;
                }
            },
            'g': {
                get: function () {
                    return this[1];
                },
                set: function (g) {
                    this[1] = g;
                }
            },
            'b': {
                get: function () {
                    return this[2];
                },
                set: function (b) {
                    this[2] = b;
                }
            },
            'rg': {
                get: function () {
                    return vec2(this[0], this[1]);
                },
                set: function (v) {
                    this[0] = v[0];
                    this[1] = v[1];
                }
            },
            'rgb': {
                get: function () {
                    return vec3(this[0], this[1], this[2]);
                },
                set: function (v) {
                    this[0] = v[0];
                    this[1] = v[1];
                    this[2] = v[2];
                }
            }
        });

        return ret;
    };


    vec4.sub = function(v1, v2, dest) {
        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];
        dest[2] = v1[2] - v2[2];
        dest[3] = v1[3] - v2[3];
        return deset;
    };

    vec4.add = function(v1, v2, dest) {
        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];
        dest[2] = v1[2] + v2[2];
        dest[3] = v1[3] + v2[3];
        return dest;
    };

    /**
     * Copy vector.
     * @param {vec4} v
     */
    vec4.copy = function(v, dest) {
        dest[0] = v[0];
        dest[1] = v[1];
        dest[2] = v[2];
        dest[3] = (v[3] !== undefined) ? v[3] : 1;
        return this;
    };

    vec4.norm = function(v) {
        var x = v[0], y = v[1], z = v[2], w = v[3];
        return sqrt(x * x + y * y + z * z + w * w);
    };

    vec4.normalize = function(v) {

        var nrm = vec4.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            v[0] *= nrm;
            v[1] *= nrm;
            v[2] *= nrm;
            v[3] *= nrm;
        }
        else {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            v[3] = 1;
        }

        return v;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec4.multiplyScalar = function(v, s, dest) {
        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;
        dest[3] = v[3] * s;
        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec4.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],
            v1w = v1[3],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];
            v2w = v2[3];

        return v1x * v2x + v1y * v2y + v1z * v2z + v1w * v2w;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    vec4.applyMatrix4 = function(v, mat, dest) {

        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        dest[0] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12] * w;
        dest[1] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13] * w;
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
        dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

        return ret;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec4.toString = function(v) {
        return '' + v[0] + ',' + v[1] + ',' + v[2] + ',' + v[3];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec4 = vec4;

}(window, document, window));
