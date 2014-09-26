(function () {
    'use strict';

    function Torus(row, column, irad, orad, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        for (var row_i = 0; row_i <= row; row_i++) {
            var r  = Math.PI * 2 / row * row_i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);

            for (var col_i = 0; col_i <= column; col_i++) {
                var tr = Math.PI * 2 / column * col_i;
                var tx = (rr * irad * orad) * Math.cos(tr);
                var ty = ry * irad;
                var tz = (rr * irad * orad) * Math.sin(tr);

                var rx = rr * Math.cos(tr);
                var rz = rr * Math.sin(tr);

                var tc = color ? color : [1, 1, 1, 1];

                var rs = 1 / column * col_i;
                var rt = 1 / row * row_i + 0.5;

                if (rt > 1.0) {
                    rt -= 1.0;
                }

                rt = 1.0 - rt;

                position.push(tx, ty, tz);
                normal.push(rx, ry, rz);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(rs, rt);
            }
        }

        for (row_i = 0; row_i < row; row_i++) {
            for (col_i = 0; col_i < column; col_i++) {
                r = (column + 1) * row_i + col_i;
                var idx0 = r;
                var idx1 = r + column + 1;
                var idx2 = r + 1;
                var idx3 = r + column + 2;
                index.push(idx0, idx1, idx2);
                index.push(idx1, idx3, idx2);
            }
        }

        this.position = position;
        this.normal   = normal;
        this.color    = colorArr;
        this.texture  = st;
        this.index    = index;
    }

    /*! --------------------------------------------------------
        EXPORTS.
    ------------------------------------------------------------ */
    window.Torus = Torus;

}());
