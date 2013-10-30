(function (win, doc, exports) {

    'use strict';

    var sin  = Math.sin,
        cos  = Math.cos,
        acos = Math.acos,
        sqrt = Math.sqrt;

    /**
     * Make rotation quat
     * @param {number} w Component of w.
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     *
     * quatの中の数値の意味は以下。
     * q = [ cos(θ/2); sin(θ/2)n ] //nはベクトル。「;」の左が実部、右が虚部。
     *   = [ cos(θ/2); (sin(θ/2)nx, sin(θ/2)ny, sin(θ/2)nz ] //ベクトル成分を分解して表記
     */
    function quat(w, x, y, z) {
        return quat.create(w, x, y, z);
    }

    /**
     * Create a quaternion.
     * @param {number} w Component of w.
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     * @return {Float32Array}
     */
    quat.create = function (w, x, y, z) {

        var elements = [];

        if (Array.isArray(x)) {
            elements = x;
        }
        else if (w === undefined) {
            elements = [1, 0, 0, 0];
        }
        else if (x === undefined) {
            elements = [w, w, w, w];
        }
        else if (y === undefined) {
            elements = [w, x, 0, 0];
        }
        else if (z === undefined) {
            elements = [w, x, y, 0];
        }
        else {
            elements = [w, x, y, z];
        }

        return new Float32Array(elements);
    };

    /**
     * convert quatuernion to matrix4.
     * @param {Float32Array} qt
     * @param {Float32Array} dest as matrix4
     */
    quat.toMat = function (qt, dest) {

        dest || (dest = mat4());

        var qw, qx, qy, qz;
        var x2, y2, z2;
        var xy, yz, zx;
        var wx, wy, wz;

        qw = qt[0];
        qx = qt[1];
        qy = qt[2];
        qz = qt[3];

        x2 = 2 * qx * qx;
        y2 = 2 * qy * qy;
        z2 = 2 * qz * qz;

        xy = 2 * qx * qy;
        yz = 2 * qy * qz;
        zx = 2 * qz * qx;

        wx = 2 * qw * qx;
        wy = 2 * qw * qy;
        wz = 2 * qw * qz;

        dest[0]  = 1 - y2 - z2;
        dest[4]  = xy - wz;
        dest[8]  = zx + wy;
        dest[12] = 0;

        dest[1]  = xy + wz;
        dest[5]  = 1 - z2 - x2;
        dest[9]  = yz - wx;
        dest[13] = 0;

        dest[2]  = zx - wy;
        dest[6]  = yz + wx;
        dest[10] = 1 - x2 - y2;
        dest[14] = 0;

        dest[3]  = 0;
        dest[7]  = 0;
        dest[11] = 0;
        dest[15] = 1;

        return dest;
    };

    /**
     * Convert quaternion to a vec3.
     * @param {Float32Array} vec as vec3
     * @param {Float32Array} qt as quaternion
     * @param {Float32Array} dest as vec3
     * @return {Float32Array} dest
     */
    quat.toVec3 = function (vec, qt, dest) {
        var qp = quat();
        var qq = quat();
        var qr = quat();

        quat.inverse(qt, qr);

        qp[0] = vec[0];
        qp[1] = vec[1];
        qp[2] = vec[2];

        quat.multiply(qr, qp, qq);
        quat.multiply(qq, qt, qr);

        dest[0] = qr[0];
        dest[1] = qr[1];
        dest[2] = qr[2];

        return dest;
    };

    /**
     * Multiply quaternions.
     *
     *  quatの掛け算の公式は以下。
     *  ・は内積、×は外積、U, Vはともにベクトル。
     *  ;の左が実部、右が虚部。
     *  A = (a; U) 
     *  B = (b; V) 
     *  AB = (ab - U・V; aV + bU + U×V)
     */
    quat.multiply = function (pq, qq, dest) {
        
        dest || (dest = quat());

        var pqw, pqx, pqy, pqz;
        var qqw, qqx, qqy, qqz;

        pqw = pq[0];
        pqx = pq[1];
        pqy = pq[2];
        pqz = pq[3];

        qqw = qq[0];
        qqx = qq[1];
        qqy = qq[2];
        qqz = qq[3];

        dest[0] = pqw * qqw - pqx * qqx - pqy * qqy - pqz * qqz;
        dest[1] = pqw * qqx + pqx * qqw + pqy * qqz - pqz * qqy;
        dest[2] = pqw * qqy - pqx * qqz + pqy * qqw + pqz * qqx;
        dest[3] = pqw * qqz + pqx * qqy - pqy * qqx + pqz * qqw;

        return dest;
    };

    /**
     * Make a rotation quaternion.
     * @param {number} radian
     * @param {Float32Array} vec
     * @return {Float32Array}
     */
    quat.rotate = function (radian, vec, dest) {

        dest || (dest = quat());

        var hrad = 0.5 * radian;
        var s = sin(hrad);

        dest[0] = cos(hrad);
        dest[1] = s * vec[0];
        dest[2] = s * vec[1];
        dest[3] = s * vec[2];

        return dest;
    };

    /**
     * Inverse quaternion.
     * @param {Float32Array} qt
     * @param {Float32Array} dest
     * @return {Float32Array}
     */
    quat.inverse = function (qt, dest) {

        dest || (dest = quat());

        dest[0] =  qt[0];
        dest[1] = -qt[1];
        dest[2] = -qt[2];
        dest[3] = -qt[3];

        return dest;
    };

    /**
     * @param {Float32Array} q1
     * @param {Float32Array} q2
     * @param {number} time
     * @param {Float32Array} dest
     * @return {Float32Array}
     */
    quat.slerp = function (q1, q2, time, dest) {

        dest || (dest = quat());

        var qr = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
        var ss = 1.0 - qr * qr;

        if (ss <= 0.0) {
            dest[0] = q1[0];
            dest[1] = q1[1];
            dest[2] = q1[2];
            dest[3] = q1[3];
        }
        else {
            ss = sqrt(ss);
            var ph = acos(qr);
            var pt = ph * time;
            var t1 = sin(ph - pt) / ss;
            var t2 = sin(pt) / ss;

            dest[0] = q1[0] * t1 + q2[0] * t2;
            dest[1] = q1[1] * t1 + q2[1] * t2;
            dest[2] = q1[2] * t1 + q2[2] * t2;
            dest[3] = q1[3] * t1 + q2[3] * t2;
        }

        return dest;
    };

    /*!--------------------------------------------------
      EXPORTS
    ----------------------------------------------------- */
    exports.quat = quat;

}(window, document, window));
