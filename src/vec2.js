(function (win, doc, exports) {

    'use strict';

    var PI   = Math.PI,
        sqrt = Math.sqrt,
        acos = Math.acos;

    /**
     * vec2
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    function vec2() {
        return vec2.create.apply(vec2, arguments);
    }

    /////////////////////////////////////////////////////////////////////

    Object.defineProperty(vec2, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 0); }
    });

    Object.defineProperty(vec2, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 1); }
    });

    Object.defineProperty(vec2, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, -1); }
    });

    Object.defineProperty(vec2, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(1, 0); }
    });

    Object.defineProperty(vec2, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(-1, 0); }
    });

    /////////////////////////////////////////////////////////////////////

    /**
     * Check to equal values.
     * @param {vec2} v
     */
    vec2.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return (v1x === v2x) && (v1y === v2y);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    vec2.create = function() {

        var elements = [],
            arr;

        for (var i = 0, l = arguments.length; i < l; i++) {
            arr = arguments[i];

            if (Float32Array.prototype.isPrototypeOf(arr)) {
                for (var j = 0, k = arr.length; j < k; j++) {
                    elements = elements.concat(arr[j]);
                }
            }
            else {
                elements = elements.concat(arguments[i]);
            }
        }

        if (elements.length > 2) {
            elements.length = 2;
        }

        switch (elements.length) {
            case 0:
                elements[0] = 0;
                elements[1] = 0;
                break;
            case 1:
                elements[1] = elements[0];
                break;
        }

        elements = new Float32Array(elements);

        //if (Array.isArray(x) || Float32Array.prototype.isPrototypeOf(x)) {
        //    elements = new Float32Array(x);
        //}
        //else if (x === undefined) {
        //    elements = [0, 0];
        //}
        //else if (y === undefined) {
        //    elements = [x, x];
        //}
        //else {
        //    elements = [x, y];
        //}
        //ret = new Float32Array(elements);
        
        Object.defineProperties(elements, {
            'x': {
                get: MathJS.getEle1,
                set: MathJS.setEle1
            },
            'y': {
                get: MathJS.getEle2,
                set: MathJS.setEle2
            }
        });

        return elements;
    };


    /**
     * Sub vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.sub = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];

        return dest;
    };

    /**
     * Add vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.add = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];

        return dest;
    };

    /**
     * Copy vector.
     * @param {Float32Array} v1
     * @param {Float32Array} dest
     */
    vec2.copy = function(v, dest) {

        dest || (dest = vec2());

        dest[0] = v[0];
        dest[1] = v[1];

        return dest;
    };

    /**
     * Calc norm from vector.
     * @param {Float32Array} v
     */
    vec2.norm = function(v) {
        var x = v[0], y = v[1];
        return sqrt(x * x + y * y);
    };

    /**
     * Calc norm from vector without sqrt.
     * @param {Float32Array} v
     */
    vec2.lengthSqr = function (v) {
        var x = v[0], y = v[1];
        return x * x + y * y;
    };

    /**
     * Normalized vector
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    vec2.normalize = function(v, dest) {

        dest || (dest = vec2());

        var nrm = vec2.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            dest[0] = v[0] * nrm;
            dest[1] = v[1] * nrm;
        }

        return dest;
    };

    /**
     * Multiply vectors.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.multiply = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] * v2[0];
        dest[1] = v1[1] * v2[1];

        return dest;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec2.multiplyScalar = function(v, s, dest) {

        dest || (dest = vec2());

        dest[0] = v[0] * s;
        dest[1] = v[1] * s;

        return dest;
    };

    /**
     * Multiple scalar with -1 to inverse vector sign.
     * @param {Float32Array} v vec2
     * @param {Float32Array} dest vec2
     */
    vec2.minus = function (v, dest) {

        dest || (dest = vec2());

        dest[0] = -v[0];
        dest[1] = -v[1];

        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec2.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return v1x * v2x + v1y * v2y;
    };

    /**
     * Calc cross
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec2.cross = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return v1x * v2y - v1y * v2x;
    };

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as radian.
     */
    vec2.lookAtRad = (function () {

        var zero = vec2.zero;

        function lookAtRad(from, to) {

            if (vec2.equal(from, zero)) {
                from = vec2.zero;
                from[0] = 0.00001;
            }

            var sub = vec2.normalize(vec2.sub(to, from));
            var fromCopy = vec2.normalize(vec2.copy(from));
            var rad = vec2.dot(sub, fromCopy);

            var dir = vec2.cross(sub, fromCopy);

            if (dir > 0) {
                return -acos(rad);
            }
            else {
                return acos(rad);
            }
        }

        return lookAtRad;
    }());

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as degrees.
     */
    vec2.lookAtDeg = function (from, to) {
        var rad = vec2.lookAtRad(from, to);
        return rad * 180 / PI;
    };

    /**
     * Apply matrix3 for a vector.
     * @param {Float32Array} v vector2
     * @param {Float32Array} mat Matrix3
     * @param {Float32Array} dest vector2
     */
    vec2.applyMatrix3 = function (v, mat, dest) {

        dest || (dest = vec2());

        var x = v[0], y = v[1];

        dest[0] = mat[0] * x + mat[3] * y + mat[6];
        dest[1] = mat[1] * x + mat[4] * y + mat[7];

        return dest;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec2.toString = function(v) {
        return '' + v[0] + ',' + v[1];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec2 = vec2;

}(window, document, window));
