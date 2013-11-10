(function (win, doc, exports) {

    'use strict';


    var sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan,
        sqrt = Math.sqrt,
        PI   = Math.PI,

        DEG_TO_RAD = PI / 180;

    /**
     * mat4
     */
    function mat4(elements) {
        var ele = [];

        if (elements === undefined) {
            return mat4.identity(mat4.create());
        }
        else if (Array.isArray(elements)) {
            return mat4.create(elements);
        }
        else {
            for (var i = 0; i < 16; i++) {
                ele.push(arguments[i] || 0);
            }
            return mat4.create(ele);
        }
    }

    mat4.create = function(elements) {
        elements || (elements = 16);
        return new Float32Array(elements);
    };

    mat4.identity = function(mat) {
        mat[0] = 1; mat[4] = 0; mat[8]  = 0; mat[12] = 0;
        mat[1] = 0; mat[5] = 1; mat[9]  = 0; mat[13] = 0;
        mat[2] = 0; mat[6] = 0; mat[10] = 1; mat[14] = 0;
        mat[3] = 0; mat[7] = 0; mat[11] = 0; mat[15] = 1;
        return mat;
    };

    /**
     * Check equal matrix
     * @param {Float32Array} mat1
     * @param {Float32Array} mat2
     */
    mat4.equal = function(mat1, mat2) {
        return (mat1[0] === mat2[0]) && (mat1[4] === mat2[4]) && (mat1[8] === mat2[8]) && (mat1[12] === mat2[12]) && (mat1[1] === mat2[1]) && (mat1[5] === mat2[5]) && (mat1[9] === mat2[9]) && (mat1[13] === mat2[13]) && (mat1[2] === mat2[2]) && (mat1[6] === mat2[6]) && (mat1[10] === mat2[10]) && (mat1[14] === mat2[14]) && (mat1[3] === mat2[3]) && (mat1[7] === mat2[7]) && (mat1[11] === mat2[11]) && (mat1[15] === mat2[15]);
    };

    /**
     * Transpose matrix.
     * @param {Float32Array} mat
     */
    mat4.transpose = function (mat) {
        var tmp;
        tmp = mat[1]; mat[1] = mat[4]; mat[4] = tmp;
        tmp = mat[2]; mat[2] = mat[8]; mat[8] = tmp;
        tmp = mat[6]; mat[6] = mat[9]; mat[9] = tmp;

        tmp = mat[3];  mat[3]  = mat[12]; mat[12] = tmp;
        tmp = mat[7];  mat[7]  = mat[13]; mat[13] = tmp;
        tmp = mat[11]; mat[11] = mat[14]; mat[14] = tmp;

        return mat;
    };

    /**
     * Get inverse matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat4.inverse = function(mat, dest) {

        dest || (dest = mat4());

        var a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44,
            b11, b12, b13, b14, b21, b22, b23, b24, b31, b32, b33, b34, b41, b42, b43, b44,
            det;

        a11 = mat[0];
        a12 = mat[4];
        a13 = mat[8];
        a14 = mat[12];
        a21 = mat[1];
        a22 = mat[5];
        a23 = mat[9];
        a24 = mat[13];
        a31 = mat[2];
        a32 = mat[6];
        a33 = mat[10];
        a34 = mat[14];
        a41 = mat[3];
        a42 = mat[7];
        a43 = mat[11];
        a44 = mat[15];

        det = (a11 * a22 * a33 * a44 + a11 * a23 * a34 * a42 + a11 * a24 * a32 * a43 + a12 * a21 * a34 * a43 + a12 * a23 * a31 * a44 + a12 * a24 * a33 * a41 + a13 * a21 * a32 * a44 + a13 * a22 * a34 * a41 + a13 * a24 * a31 * a42 + a14 * a21 * a33 * a42 + a14 * a22 * a31 * a43 + a14 * a23 * a32 * a41 - a11 * a22 * a34 * a43 - a11 * a23 * a32 * a44 - a11 * a24 * a33 * a42 - a12 * a21 * a33 * a44 - a12 * a23 * a34 * a41 - a12 * a24 * a31 * a43 - a13 * a21 * a34 * a42 - a13 * a22 * a31 * a44 - a13 * a24 * a32 * a41 - a14 * a21 * a32 * a43 - a14 * a22 * a33 * a41 - a14 * a23 * a31 * a42);

        if ((0.0001 > det && det > -0.0001)) {
            return null;
        }

        b11 = ((a22 * a33 * a44) + (a23 * a34 * a42) + (a24 * a32 * a43) - (a22 * a34 * a43) - (a23 * a32 * a44) - (a24 * a33 * a42)) / det;
        b12 = ((a12 * a34 * a43) + (a13 * a32 * a44) + (a14 * a33 * a42) - (a12 * a33 * a44) - (a13 * a34 * a42) - (a14 * a32 * a43)) / det;
        b13 = ((a12 * a23 * a44) + (a13 * a24 * a42) + (a14 * a22 * a43) - (a12 * a24 * a43) - (a13 * a22 * a44) - (a14 * a23 * a42)) / det;
        b14 = ((a12 * a24 * a33) + (a13 * a22 * a34) + (a14 * a23 * a32) - (a12 * a23 * a34) - (a13 * a24 * a32) - (a14 * a22 * a33)) / det;
        b21 = ((a21 * a34 * a43) + (a23 * a31 * a44) + (a24 * a33 * a41) - (a21 * a33 * a44) - (a23 * a34 * a41) - (a24 * a31 * a43)) / det;
        b22 = ((a11 * a33 * a44) + (a13 * a34 * a41) + (a14 * a31 * a43) - (a11 * a34 * a43) - (a13 * a31 * a44) - (a14 * a33 * a41)) / det;
        b23 = ((a11 * a24 * a43) + (a13 * a21 * a44) + (a14 * a23 * a41) - (a11 * a23 * a44) - (a13 * a24 * a41) - (a14 * a21 * a43)) / det;
        b24 = ((a11 * a23 * a34) + (a13 * a24 * a31) + (a14 * a21 * a33) - (a11 * a24 * a33) - (a13 * a21 * a34) - (a14 * a23 * a31)) / det;
        b31 = ((a21 * a32 * a44) + (a22 * a34 * a41) + (a24 * a31 * a42) - (a21 * a34 * a42) - (a22 * a31 * a44) - (a24 * a32 * a41)) / det;
        b32 = ((a11 * a34 * a42) + (a12 * a31 * a44) + (a14 * a32 * a41) - (a11 * a32 * a44) - (a12 * a34 * a41) - (a14 * a31 * a42)) / det;
        b33 = ((a11 * a22 * a44) + (a12 * a24 * a41) + (a14 * a21 * a42) - (a11 * a24 * a42) - (a12 * a21 * a44) - (a14 * a22 * a41)) / det;
        b34 = ((a11 * a24 * a32) + (a12 * a21 * a34) + (a14 * a22 * a31) - (a11 * a22 * a34) - (a12 * a24 * a31) - (a14 * a21 * a32)) / det;
        b41 = ((a21 * a33 * a42) + (a22 * a31 * a43) + (a23 * a32 * a41) - (a21 * a32 * a43) - (a22 * a33 * a41) - (a23 * a31 * a42)) / det;
        b42 = ((a11 * a32 * a43) + (a12 * a33 * a41) + (a13 * a31 * a42) - (a11 * a33 * a42) - (a12 * a31 * a43) - (a13 * a32 * a41)) / det;
        b43 = ((a11 * a23 * a42) + (a12 * a21 * a43) + (a13 * a22 * a41) - (a11 * a22 * a43) - (a12 * a23 * a41) - (a13 * a21 * a42)) / det;
        b44 = ((a11 * a22 * a33) + (a12 * a23 * a31) + (a13 * a21 * a32) - (a11 * a23 * a32) - (a12 * a21 * a33) - (a13 * a22 * a31)) / det;

        dest[0] = b11; dest[4] = b12; dest[8] = b13; dest[12] = b14;
        dest[1] = b21; dest[5] = b22; dest[9] = b23; dest[13] = b24;
        dest[2] = b31; dest[6] = b32; dest[10] = b33; dest[14] = b34;
        dest[3] = b41; dest[7] = b42; dest[11] = b43; dest[15] = b44;

        return dest;
    };


    /**
     * Copy matrix
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    mat4.copy = function(mat, dest) {

        dest || (dest = mat4());

        dest[0] = mat[0]; dest[4] = mat[4]; dest[8] = mat[8]; dest[12] = mat[12];
        dest[1] = mat[1]; dest[5] = mat[5]; dest[9] = mat[9]; dest[13] = mat[13];
        dest[2] = mat[2]; dest[6] = mat[6]; dest[10] = mat[10]; dest[14] = mat[14];
        dest[3] = mat[3]; dest[7] = mat[7]; dest[11] = mat[11]; dest[15] = mat[15];

        return dest;
    };

    /**
     * Make frustum
     * @param {number} left
     * @param {number} right
     * @param {number} bottom
     * @param {number} top
     * @param {number} near
     * @param {number} far
     * @param {mat4} dest
     */
    mat4.makeFrustum = function(left, right, bottom, top, near, far, dest) {

        var a, b, c, d, vh, vw, x, y;
        dest || (dest = mat4());

        vw = right - left;
        vh = top - bottom;
        x = 2 * near / vw;
        y = 2 * near / vh;

        a = (right + left) / (right - left);
        b = (top + bottom) / (top - bottom);
        c = -(far + near) / (far - near);
        d = -(2 * near * far) / (far - near);

        dest[0] = x; dest[4] = 0; dest[8] = a; dest[12] = 0;
        dest[1] = 0; dest[5] = y; dest[9] = b; dest[13] = 0;
        dest[2] = 0; dest[6] = 0; dest[10] = c; dest[14] = d;
        dest[3] = 0; dest[7] = 0; dest[11] = -1; dest[15] = 0;

        return dest;
    };

    /**
     * Create perspective matrix.
     * @param {number} fov Field of View.
     * @param {number} aspect
     * @param {number} near
     * @param {number} far
     */
    mat4.perspective = function(fov, aspect, near, far, dest) {

        var xmax, xmin, ymax, ymin;
        dest || (dest = mat4());

        ymax = near * tan(fov * DEG_TO_RAD * 0.5);
        ymin = -ymax;
        xmin = ymin * aspect;
        xmax = ymax * aspect;

        return mat4.makeFrustum(xmin, xmax, ymin, ymax, near, far, dest);
    };

    /**
     * Multiply matries.
     * @param {Float32Array} A
     * @param {Float32Array} B
     * @param {Float32Array} dest
     */
    mat4.multiply = function(A, B, dest) {

        var A11, A12, A13, A14, A21, A22, A23, A24, A31, A32, A33, A34, A41, A42, A43, A44,
            B11, B12, B13, B14, B21, B22, B23, B24, B31, B32, B33, B34, B41, B42, B43, B44,
            ae, be;

        dest || (dest = mat4());

        ae = A;
        be = B;

        A11 = ae[0]; A12 = ae[4]; A13 = ae[8]; A14 = ae[12];
        A21 = ae[1]; A22 = ae[5]; A23 = ae[9]; A24 = ae[13];
        A31 = ae[2]; A32 = ae[6]; A33 = ae[10]; A34 = ae[14];
        A41 = ae[3]; A42 = ae[7]; A43 = ae[11]; A44 = ae[15];

        B11 = be[0]; B12 = be[4]; B13 = be[8]; B14 = be[12];
        B21 = be[1]; B22 = be[5]; B23 = be[9]; B24 = be[13];
        B31 = be[2]; B32 = be[6]; B33 = be[10]; B34 = be[14];
        B41 = be[3]; B42 = be[7]; B43 = be[11]; B44 = be[15];

        dest[0]  = A11 * B11 + A12 * B21 + A13 * B31 + A14 * B41;
        dest[4]  = A11 * B12 + A12 * B22 + A13 * B32 + A14 * B42;
        dest[8]  = A11 * B13 + A12 * B23 + A13 * B33 + A14 * B43;
        dest[12] = A11 * B14 + A12 * B24 + A13 * B34 + A14 * B44;
        dest[1]  = A21 * B11 + A22 * B21 + A23 * B31 + A24 * B41;
        dest[5]  = A21 * B12 + A22 * B22 + A23 * B32 + A24 * B42;
        dest[9]  = A21 * B13 + A22 * B23 + A23 * B33 + A24 * B43;
        dest[13] = A21 * B14 + A22 * B24 + A23 * B34 + A24 * B44;
        dest[2]  = A31 * B11 + A32 * B21 + A33 * B31 + A34 * B41;
        dest[6]  = A31 * B12 + A32 * B22 + A33 * B32 + A34 * B42;
        dest[10] = A31 * B13 + A32 * B23 + A33 * B33 + A34 * B43;
        dest[14] = A31 * B14 + A32 * B24 + A33 * B34 + A34 * B44;
        dest[3]  = A41 * B11 + A42 * B21 + A43 * B31 + A44 * B41;
        dest[7]  = A41 * B12 + A42 * B22 + A43 * B32 + A44 * B42;
        dest[11] = A41 * B13 + A42 * B23 + A43 * B33 + A44 * B43;
        dest[15] = A41 * B14 + A42 * B24 + A43 * B34 + A44 * B44;

        return dest;
    };

    /**
     * @param {Float32Array} mat
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    mat4.translate = function(mat, v, dest) {

        var x = v[0],
            y = v[1],
            z = v[2];

        dest || (dest = mat4());

        dest[0]  = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
        dest[4]  = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
        dest[8]  = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
        dest[12] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
        dest[13] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
        dest[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
        dest[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];

        return dest;
    };

    /**
     * Scale matrix
     * @param {Float32Array} mat
     * @param {Float32Array} v
     * @param {Float32Array} dest
     */
    mat4.scale = function(mat, v, dest) {

        var x = v[0],
            y = v[1],
            z = v[2];

        dest || (dest = mat4());

        dest[0]  = mat[0]  * x;
        dest[1]  = mat[1]  * x;
        dest[2]  = mat[2]  * x;
        dest[3]  = mat[3]  * x;
        dest[4]  = mat[4]  * y;
        dest[5]  = mat[5]  * y;
        dest[6]  = mat[6]  * y;
        dest[7]  = mat[7]  * y;
        dest[8]  = mat[8]  * z;
        dest[9]  = mat[9]  * z;
        dest[10] = mat[10] * z;
        dest[11] = mat[11] * z;
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        
        return dest;
    };

    /**
     * Create rotation matrix with any axis.
     * @param {number} angle
     * @param {Float32Array} axis
     * @return {mat4} this
     */
    mat4.rotate = function(mat, angle, axis, dest) {

        var x = axis[0], y = axis[1], z = axis[2],
            sq = sqrt(x * x + y * y + z * z);

        dest || (dest = mat4());

        if(!sq){
            return null;
        }

        if(sq !== 1){
            sq = 1 / sq;
            x *= sq;
            y *= sq;
            z *= sq;
        }

        angle = angle * DEG_TO_RAD;

        var rot = mat4(),
            co = cos(angle),
            si = sin(angle),
            a = (1 - co),
            b = x * x,
            c = y * y,
            d = z * z,
            e = x * y,
            f = x * z,
            g = y * z,
            h = x * si,
            i = y * si,
            j = z * si;


        rot[0] = b * a + co; rot[4] = e * a - j;  rot[8]  = f * a + i;
        rot[1] = e * a + j;  rot[5] = c * a + co; rot[9]  = g * a - h;
        rot[2] = f * a - i;  rot[6] = g * a + h;  rot[10] = d * a + co;

        return mat4.multiply(mat, rot, dest);
    };


    /**
     * @param {Float32Array} eye
     * @param {Float32Array} target
     * @param {Float32Array} up
     * @param {mat4} dest
     */
    mat4.lookAt = function(eye, target, up, dest) {

        var x = vec3(),
            y = vec3(),
            z = vec3(),
            tx, ty, tz;

        dest || (dest = mat4());

        vec3.normalize(vec3.sub(eye, target, z));
        vec3.normalize(vec3.cross(z, up, x));
        vec3.normalize(vec3.cross(x, z, y));

        tx = vec3.dot(eye, x);
        ty = vec3.dot(eye, y);
        tz = vec3.dot(eye, z);

        var xx = x[0],
            xy = x[1],
            xz = x[2],

            yx = y[0],
            yy = y[1],
            yz = y[2],

            zx = z[0],
            zy = z[1],
            zz = z[2];

        dest[0] = xx; dest[4] = xy; dest[8]  = xz; dest[12] = -tx;
        dest[1] = yx; dest[5] = yy; dest[9]  = yz; dest[13] = -ty;
        dest[2] = zx; dest[6] = zy; dest[10] = zz; dest[14] = -tz;

        return dest;
    };


    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.mat4 = mat4;

}(window, document, window));
