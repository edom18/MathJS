(function (win, doc, exports) {

    'use strict';

    var floor = Math.floor;

    function Spline() {
        this.a = [];
        this.b = [];
        this.c = [];
        this.d = [];

        this.num = 0;
    }
    Spline.prototype = {
        constructor: Spline,
        num: 0,
        a: null,
        b: null,
        c: null,
        d: null,
        init: function (sp) {
            var tmp;
            var w = [];
            var i;

            this.num = sp.length - 1;
            var num = this.num;

            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;

            // 3次多項式の0次係数(a)を設定
            for(i = 0; i <= num; i++) {
                a[i] = sp[i];
            }

            // 3次多項式の2次係数(c)を計算
            // 連立方程式を解く。
            // 但し、一般解法でなくスプライン計算にチューニングした方法
            c[0] = c[num] = 0.0;
            for(i = 1; i < num; i++) {
                c[i] = 3.0 * (a[i - 1] - 2.0 * a[i] + a[i + 1]);
            }

            // 左下を消す
            w[0] = 0.0;
            for(i = 1; i < num; i++) {
                tmp = 4.0 - w[i - 1];
                c[i] = (c[i] - c[i - 1]) / tmp;
                w[i] = 1.0 / tmp;
            }
            // 右上を消す
            for(i = num - 1; i > 0; i--) {
                c[i] = c[i] - c[i + 1] * w[i];
            }

            // 3次多項式の1次係数(b)と3次係数(b)を計算
            b[num] = d[num] = 0.0;
            for (i = 0; i < num; i++) {
                d[i] = (c[i + 1] - c[i]) / 3.0;
                b[i] = a[i + 1] - a[i] - c[i] - d[i];
            }
        },

        // 媒介変数(0～num - 1の実数）に対する値を計算
        culc: function (t) {
            var j = floor(t);
            var dt;
            var num = this.num;

            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;

            if (j < 0) {
                j = 0;
            }
            else if (j >= num) {
                j = num - 1; // 丸め誤差を考慮
            }

            dt = t - j;

            return a[j] + (b[j] + (c[j] + d[j] * dt) * dt ) * dt;
        }
    };

    /*! -----------------------------------------------------
        EXPORTS
    --------------------------------------------------------- */
    window.Spline = Spline;

}(window, document, window));

