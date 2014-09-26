(function () {
    'use strict';

    /**
     * Create a sphere.
     *
     * @param {number} row
     * @param {number} column
     * @param {number} radius
     * @param {Array<number>} color
     *
     * @return {Object}
     */
    function Sphere(row, column, radius, color) {
        var position = [];
        var normal   = [];
        var colorArr = [];
        var st       = [];
        var index    = [];

        // Generate position, normal, color, texture coord.
        for (var row_i = 0; row_i <= row; row_i++) {
            var r  = Math.PI / row * row_i;
            var ry = Math.cos(r);
            var rr = Math.sin(r);

            for (var col_i = 0; col_i <= column; col_i++) {
                var tr = Math.PI * 2 / column * col_i;

                var tx = rr * radius * Math.cos(tr);
                var ty = ry * radius;
                var tz = rr * radius * Math.sin(tr);

                var rx = rr * Math.cos(tr);
                var rz = rr * Math.sin(tr);

                var tc = color ? color : [1, 1, 1, 1];

                position.push(tx, ty, tz);
                normal.push(rx, ry, rz);
                colorArr.push(tc[0], tc[1], tc[2], tc[3]);
                st.push(1 - 1 / column * col_i, 1 / row * row_i);
            }
        }

        // Generate indecies.
        for (r = 0, row_i = 0; row_i < row; row_i++) {
            for (col_i = 0; col_i < column; col_i++) {
                r = (column + 1) * row_i + col_i;
                var idx0 = r;
                var idx1 = r + 1;
                var idx2 = r + column + 2;
                var idx3 = r + column + 1;
                index.push(idx0, idx1, idx2);
                index.push(idx0, idx2, idx3);
            }
        }

        this.position = position;
        this.normal   = normal;
        this.color    = colorArr;
        this.texture  = st;
        this.index    = index;
    }

    /*! ----------------------------------------------------
        EXPORTS.
    -------------------------------------------------------- */
    window.Sphere = Sphere;

}());
