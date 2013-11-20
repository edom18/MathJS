(function (win, doc, exports) {

    'use strict';


    //Import.
    var sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan,
        sqrt = Math.sqrt,
        PI   = Math.PI,

        DEG_TO_RAD = PI / 180;

    /**
     * mat3
     */
    function mat3(elements) {
        var ele = [];

        if (elements === undefined) {
            return mat3.identity(mat3.create());
        }
        else if (Array.isArray(elements)) {
            return mat3.create(elements);
        }
        else {
            for (var i = 0; i < 9; i++) {
                ele.push(arguments[i] || 0);
            }
            return mat3.create(ele);
        }
    }

    mat3.create = function(elements) {
        elements || (elements = 9);
        return new Float32Array(elements);
    };

    mat3.identity = function(mat) {
        mat[0] = 1; mat[3] = 0; mat[6] = 0;
        mat[1] = 0; mat[4] = 1; mat[7] = 0;
        mat[2] = 0; mat[5] = 0; mat[8] = 1;
        return mat;
    };

    /**
     * Check equal matrix
     * @param {Float32Array} mat1
     * @param {Float32Array} mat2
     */
    mat3.equal = function(mat1, mat2) {
        return (
            (mat1[0] === mat2[0]) &&
            (mat1[1] === mat2[1]) &&
            (mat1[2] === mat2[2]) &&
            (mat1[3] === mat2[3]) &&
            (mat1[4] === mat2[4]) &&
            (mat1[5] === mat2[5]) &&
            (mat1[6] === mat2[6]) &&
            (mat1[7] === mat2[7]) &&
            (mat1[8] === mat2[8])
        );
    };

    /**
     * Transpose matrix.
     * @param {Float32Array} mat
     */
    mat3.transpose = function (mat) {
        var tmp;

        tmp = mat[1]; mat[1] = mat[3]; mat[3] = tmp;
        tmp = mat[2]; mat[2] = mat[6]; mat[6] = tmp;
        tmp = mat[5]; mat[5] = mat[7]; mat[7] = tmp;

        return mat;
    };

    /**
     * Get inverse matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat3.inverse = function(mat, dest) {

        dest || (dest = mat3());

        var a11, a12, a13, a21, a22, a23, a31, a32, a33,
            b11, b12, b13, b21, b22, b23, b31, b32, b33,
            det;

        a11 = mat[0];
        a12 = mat[3];
        a13 = mat[6];
        a21 = mat[1];
        a22 = mat[4];
        a23 = mat[7];
        a31 = mat[2];
        a32 = mat[5];
        a33 = mat[8];

        det = (a11 * a22 * a33) + (a21 * a32 * a13) + (a31 * a12 * a23) - (a11 * a32 * a23) - (a31 * a22 * a13) - (a21 * a12 * a33);

        if ((0.0001 > det && det > -0.0001)) {
            return null;
        }

        b11 = (a22 * a33 - a23 * a32) / det;
        b12 = (a13 * a32 - a12 * a33) / det;
        b13 = (a12 * a23 - a13 * a22) / det;
        b21 = (a23 * a31 - a21 * a33) / det;
        b22 = (a11 * a33 - a13 * a31) / det;
        b23 = (a13 * a21 - a11 * a23) / det;
        b31 = (a21 * a32 - a22 * a31) / det;
        b32 = (a12 * a31 - a11 * a32) / det;
        b33 = (a11 * a22 - a12 * a21) / det;

        dest[0] = b11; dest[3] = b12; dest[6] = b13;
        dest[1] = b21; dest[4] = b22; dest[7] = b23;
        dest[2] = b31; dest[5] = b32; dest[8] = b33;

        return dest;
    };


    /**
     * Copy matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat3.copy = function(mat, dest) {

        dest || (dest = mat3());

        dest[0] = mat[0]; dest[3] = mat[3]; dest[6] = mat[6];
        dest[1] = mat[1]; dest[4] = mat[4]; dest[7] = mat[7];
        dest[2] = mat[2]; dest[5] = mat[5]; dest[8] = mat[8];

        return dest;
    };

    /**
     * Multiply matries.
     * @param {Float32Array} A
     * @param {Float32Array} B
     * @param {Float32Array} dest
     */
    mat3.multiply = function(A, B, dest) {

        var A11, A12, A13, A21, A22, A23, A31, A32, A33,
            B11, B12, B13, B21, B22, B23, B31, B32, B33,
            ae, be;

        dest || (dest = mat3());

        ae = A;
        be = B;

        A11 = ae[0]; A12 = ae[3]; A13 = ae[6];
        A21 = ae[1]; A22 = ae[4]; A23 = ae[7];
        A31 = ae[2]; A32 = ae[5]; A33 = ae[8];

        B11 = be[0]; B12 = be[3]; B13 = be[6];
        B21 = be[1]; B22 = be[4]; B23 = be[7];
        B31 = be[2]; B32 = be[5]; B33 = be[8];

        dest[0] = A11 * B11 + A12 * B21 + A13 * B31;
        dest[3] = A11 * B12 + A12 * B22 + A13 * B32;
        dest[6] = A11 * B13 + A12 * B23 + A13 * B33;

        dest[1] = A21 * B11 + A22 * B21 + A23 * B31;
        dest[4] = A21 * B12 + A22 * B22 + A23 * B32;
        dest[7] = A21 * B13 + A22 * B23 + A23 * B33;

        dest[2] = A31 * B11 + A32 * B21 + A33 * B31;
        dest[5] = A31 * B12 + A32 * B22 + A33 * B32;
        dest[8] = A31 * B13 + A32 * B23 + A33 * B33;

        return dest;
    };

    /**
     * Create rotate matrix.
     * @param {number} rad
     * @param {Float32Array} dest
     */
    mat3.rotate = function (rad, dest) {

        /*!
        * OpenGLのZ軸による回転行列（の2次元版）
        * | cos(r) -sin(r)  0 |
        * | sin(r)  cos(r)  0 |
        * |      0      0   1 |
        */

        dest || (dest = mat3());

        var c = cos(rad);
        var s = sin(rad);

        dest[0] = c; dest[3] = -s; dest[6] = 0;
        dest[1] = s; dest[4] =  c; dest[7] = 0;
        dest[2] = 0; dest[5] =  0; dest[8] = 1;

        return dest;
    };

    /**
     * @param {Float32Array} v for scale
     * @param {Float32Array} dest
     */
    mat3.scale = function (v, dest) {

        dest || (dest = {});

        var x = v[0], y = v[1];

        dest[0] = x; dest[3] = 0; dest[6] = 0;
        dest[1] = 0; dest[4] = y; dest[7] = 0;
        dest[2] = 0; dest[5] = 0; dest[8] = 1;

        return dest;
    };


    /**
     * Apply translation to a matrix.
     * @param {Float32Array} mat An applied matrix.
     * @param {Float32Array} v A translate vector.
     * @param {Float32Array} dest
     */
    mat3.translate = function (v, dest) {
        
        dest || (dest = mat3());

        var x = v[0], y = v[1];

        dest[0] = 1; dest[3] = 0; dest[6] = x;
        dest[1] = 0; dest[4] = 1; dest[7] = y;
        dest[2] = 0; dest[5] = 0; dest[8] = 1;

        return dest;
    };

    mat3.translate2 = function (mat, v, dest) {
        
        dest || (dest = mat3());

        var x = v[0], y = v[1];

        dest[0] = mat[0]; dest[3] = mat[3];
        dest[1] = mat[1]; dest[4] = mat[4];
        dest[2] = mat[2]; dest[5] = mat[5];

        dest[6] = mat[0] * x + mat[3] * y + mat[6];
        dest[7] = mat[1] * x + mat[4] * y + mat[7];
        dest[8] = mat[2] * x + mat[5] * y + mat[8];

        return dest;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.mat3 = mat3;

}(window, document, window));
