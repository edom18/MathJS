(function (win, doc, exports) {

    var MathJS = {};

    MathJS.getEle1 = function () {
        return this[0];
    };
    MathJS.setEle1 = function (x) {
        this[0] = x;
    };
    MathJS.getEle2 = function () {
        return this[1];
    };
    MathJS.setEle2 = function (y) {
        this[1] = y;
    };
    MathJS.getEle3 = function () {
        return this[2];
    };
    MathJS.setEle3 = function (z) {
        this[2] = z;
    };
    MathJS.getEle4 = function () {
        return this[3];
    };
    MathJS.setEle4 = function (w) {
        this[3] = w;
    };
    MathJS.getEle12 = function () {
        return vec2(this.x, this.y);
    };
    MathJS.setEle12 = function (v) {
        this[0] = v[0];
        this[1] = v[1];
    };
    MathJS.getEle123 = function () {
        return vec3(this[0], this[1], this[2]);
    };
    MathJS.setEle123 = function (v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
    };

    /*! ------------------------------------------------------------
        EXPORTS
    ---------------------------------------------------------------- */
    exports.MathJS = MathJS;

}(window, document, window));
