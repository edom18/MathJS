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
                var x = width  * colUnit;
                var z = height * rowUnit;
                var stx = -((1 / column) * col_i);
                var stz = (1 / row) * row_i;

                var tc = color ? color : [1, 1, 1, 1];

                position.push(x, 0, z);
                normal.push(0, 1, 0);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(stx, stz);
            }
        }

        // Generate indecies.
        for (col_i = 0; col_i < column; col_i++) {
            for (row_i = 0; row_i < row; row_i++) {
                var base = ((column + 1) * row_i) + col_i;
                var idx0 = base;
                var idx1 = base + 1;
                var idx2 = base + column + 1;
                var idx3 = base + column + 2;

                index.push(idx0, idx1, idx2);
                index.push(idx3, idx2, idx1);
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
