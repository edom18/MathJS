(function () {
    'use strict';

    function Plane(width, height, row, column, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        for (var col_i = 0; col_i <= column; col_i++) {
            for (var row_i = 0; row_i <= row; row_i++) {
                var rowUnit = (row_i / row) * 2 - 1;
                var colUnit = -((col_i / column) * 2 - 1);
                var x = width  * rowUnit;
                var z = height * colUnit;
                var stx = (1 / row) * row_i;
                var stz = (1 / column) * col_i;

                var tc = color ? color : [1, 1, 1, 1];

                position.push(x, 0, z);
                normal.push(0, 1, 0);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(stx, stz);
            }
        }

        for (col_i = 0; col_i < column; col_i++) {
            for (row_i = 0; row_i < row; row_i++) {
                var base = (column * row_i)
                var idx0 = base + col_i;
                var idx1 = base + col_i + 1;
                var idx2 = base + col_i + column + 2;
                var idx3 = base + col_i + column + 1;

                index.push(idx0, idx1, idx2);
                index.push(idx0, idx2, idx3);
            }
        }

        this.position     = position;
        this.normal       = normal;
        this.color        = colorArr;
        this.textureCoord = st;
        this.index        = index;
    }

    /*! ----------------------------------------------------
        EXPORTS.
    -------------------------------------------------------- */
    window.Plane = Plane;

}());
