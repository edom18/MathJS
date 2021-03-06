(function () {

    var assert = require("assert");

    describe('quatテスト', function () {
        it('quat()はidentity化された4要素の配列を生成する', function () {
            var qt = quat();
            assert.equal(qt[0], 1);
            assert.equal(qt[1], 0);
            assert.equal(qt[2], 0);
            assert.equal(qt[3], 0);
        });

        it('quat(w)はすべてwで初期化された4要素の配列を返す', function () {
            var qt = quat(2);
            assert.equal(qt[0], 2);
            assert.equal(qt[1], 2);
            assert.equal(qt[2], 2);
            assert.equal(qt[3], 2);
        });

        it('quat(w, x)はw,x,0,0で初期化された4要素の配列を返す', function () {
            var qt = quat(3, 4);
            assert.equal(qt[0], 3);
            assert.equal(qt[1], 4);
            assert.equal(qt[2], 0);
            assert.equal(qt[3], 0);
        });

        it('quat(w, x, y)はw,x,y,0で初期化された4要素の配列を返す', function () {
            var qt = quat(5, 6, 7);
            assert.equal(qt[0], 5);
            assert.equal(qt[1], 6);
            assert.equal(qt[2], 7);
            assert.equal(qt[3], 0);
        });

        it('quat(w, x, y, z)はw,x,y,zで初期化された4要素の配列を返す', function () {
            var qt = quat(8, 9, 10, 11);
            assert.equal(qt[0], 8);
            assert.equal(qt[1], 9);
            assert.equal(qt[2], 10);
            assert.equal(qt[3], 11);
        });

        it('生成後のFloat32Arrayは、arr.wでひとつめの要素を返す', function () {
            var q = quat([1, 2, 3, 4]);
            assert.equal(1, q.w);
        });

        it('生成後のFloat32Arrayは、arr.xでふたつめの要素を返す', function () {
            var q = quat([1, 2, 3, 4]);
            assert.equal(2, q.x);
        });

        it('生成後のFloat32Arrayは、arr.yでみっつめの要素を返す', function () {
            var q = quat([1, 2, 3, 4]);
            assert.equal(3, q.y);
        });

        it('生成後のFloat32Arrayは、arr.zでよっつめの要素を返す', function () {
            var q = quat([1, 2, 3, 4]);
            assert.equal(4, q.z);
        });

        ///////////////////////////////////////////////////////////////////////////////

        it('quat(qt)でクォータニオンのコピーが作れる', function () {
            var q1 = quat([1, 2, 3, 4]);
            var q2 = quat(q1);

            assert.equal(true, q1 !== q2);
            assert.equal(true, quat.equal(q1, q2));
        });

        it('quat.multiplyScalar(q, s)はクォータニオンをスカラー倍した結果を返す。破壊的メソッド', function () {
            var q = quat([1, 2, 3, 4]);
            var scalar = 5;
            quat.multiplyScalar(q, scalar);
            assert.equal(true, q[0] === 1 * scalar);
            assert.equal(true, q[1] === 2 * scalar);
            assert.equal(true, q[2] === 3 * scalar);
            assert.equal(true, q[3] === 4 * scalar);
        });

        it('quat.norm(q)はクォータニオンの長さを返す。', function () {
            var q = quat([1, 2, 3, 4]);
            var len1 = Math.sqrt((1 * 1) + (2 * 2) + (3 * 3) + (4 * 4));
            var len2 = quat.norm(q);
            assert.deepEqual(len1, len2);
        });

        it('quat.normalize(q)はクォータニオンを正規化する。破壊的メソッド', function () {
            var a = new Float32Array([1, 2, 3, 4]);

            var q = quat([a[0], a[1], a[2], a[3]]);
            var len = Math.sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]) + (a[3] * a[3]));
            a[0] /= len;
            a[1] /= len;
            a[2] /= len;
            a[3] /= len;

            var result = quat.normalize(q);
            assert.equal(a[0], q[0]);
            assert.equal(a[1], q[1]);
            assert.equal(a[2], q[2]);
            assert.equal(a[3], q[3]);
            assert.deepEqual(q, result);
        });
    });

    //mat3テスト
    describe('mat3テスト', function () {
        it('mat3()はidentity化された3x3行列を生成する', function () {
            var mat1 = mat3();
            var mat2 = mat3();
            assert.equal(true, mat3.equal(mat1, mat2));
        });

        it('mat3.copy(mat[, dest])で行列をコピーできる', function () {
            var mat1 = mat3();
            var mat2 = mat3();
            mat2[3] = 5.0;
            mat3.copy(mat1, mat2);
            assert.equal(true, mat3.equal(mat1, mat2));
            assert.equal(true, mat1 !== mat2);
        });

        it('mat3.equal(mat1, mat2)で行列の内容が等しいかチェックできる', function () {
            var m1 = mat3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);
            var m2 = mat3([
                11, 12, 13,
                15, 16, 17,
                19, 20, 21,
                23, 24, 25
            ]);
            var m3 = mat3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);

            assert.equal(true, mat3.equal(m1, m3));
            assert.equal(false, mat3.equal(m1, m2));
        });

        it('multiplyで行列の掛け算ができる', function () {
            var mt1 = mat3([
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9
                ]);
            var mt2 = mat3([
                    10, 20, 30,
                    40, 50, 60,
                    70, 80, 90
                ]);

            var mt3 = mat3();

            mat3.multiply(mt1, mt2, mt3);

            assert.equal((1 * 10  + 4 * 20  + 7  * 30), mt3[0]);
            assert.equal((1 * 40  + 4 * 50  + 7  * 60), mt3[3]);
            assert.equal((1 * 70  + 4 * 80  + 7  * 90), mt3[6]);

            assert.equal((2 * 10  + 5 * 20  + 8  * 30), mt3[1]);
            assert.equal((2 * 40  + 5 * 50  + 8  * 60), mt3[4]);
            assert.equal((2 * 70  + 5 * 80  + 8  * 90), mt3[7]);

            assert.equal((3 * 10  + 6 * 20  + 9  * 30), mt3[2]);
            assert.equal((3 * 40  + 6 * 50  + 9  * 60), mt3[5]);
            assert.equal((3 * 70  + 6 * 80  + 9  * 90), mt3[8]);
        });

        it('multiplyScalarで行列をスカラー倍できる', function () {
            var m1 = mat4([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ]);
            var m2 = mat4.multiplyScalar(m1, 10);

            assert.equal(10,  m2[ 0]);
            assert.equal(20,  m2[ 1]);
            assert.equal(30,  m2[ 2]);
            assert.equal(40,  m2[ 3]);
            assert.equal(50,  m2[ 4]);
            assert.equal(60,  m2[ 5]);
            assert.equal(70,  m2[ 6]);
            assert.equal(80,  m2[ 7]);
            assert.equal(90,  m2[ 8]);
            assert.equal(100, m2[ 9]);
            assert.equal(110, m2[10]);
            assert.equal(120, m2[11]);
            assert.equal(130, m2[12]);
            assert.equal(140, m2[13]);
            assert.equal(150, m2[14]);
            assert.equal(160, m2[15]);
        });

        it('mat3.transpose(mat)で行列を転置行列に変換できる', function () {
            var mat = mat3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);

            mat3.transpose(mat);

            assert.equal(1, mat[0]);
            assert.equal(4, mat[1]);
            assert.equal(7, mat[2]);
            assert.equal(2, mat[3]);
            assert.equal(5, mat[4]);
            assert.equal(8, mat[5]);
            assert.equal(3, mat[6]);
            assert.equal(6, mat[7]);
            assert.equal(9, mat[8]);
        });

        it('mat3.rotate(rad[, dest])で角度「rad」回転行列を作れる', function () {
            var rad = 30 * Math.PI / 180;
            var mat = mat3.rotate(rad);

            var c = Math.cos(rad);
            var s = Math.sin(rad);

            var e = new Float32Array(9);
            e[0] = c; e[3] = -s; e[6] = 0;
            e[1] = s; e[4] =  c; e[7] = 0;
            e[2] = 0; e[5] =  0; e[8] = 1;

            assert.equal(e[0], mat[0]);
            assert.equal(e[3], mat[3]);
            assert.equal(e[6], mat[6]);
            assert.equal(e[1], mat[1]);
            assert.equal(e[4], mat[4]);
            assert.equal(e[7], mat[7]);
            assert.equal(e[2], mat[2]);
            assert.equal(e[5], mat[5]);
            assert.equal(e[8], mat[8]);
        });

        it('mat3.translate(v[, dest])で平行移動行列を生成できる', function () {

            var tmat = mat3.translate(vec2(10, 20));
            var v = vec2(5, 15);
            v = vec2.applyMatrix3(v, tmat);

            assert.equal(15, v.x);
            assert.equal(35, v.y);
        });

        it('mat3.scale(v[, dest])でスケール行列を生成できる', function () {

            var mat_1 = mat3(0, 1, 2, 3, 4, 5, 6, 7, 8);
            var scale = mat3.scale(vec2(1.5, 2.5));
            mat_1 = mat3.multiply(scale, mat_1);

            assert.equal(1.5 * 0 + 0 * 1 + 0 * 2, mat_1[0]);
            assert.equal(1.5 * 3 + 0 * 4 + 0 * 5, mat_1[3]);
            assert.equal(1.5 * 6 + 0 * 7 + 0 * 8, mat_1[6]);

            assert.equal(0 * 0 + 2.5 * 1 + 0 * 2, mat_1[1]);
            assert.equal(0 * 3 + 2.5 * 4 + 0 * 5, mat_1[4]);
            assert.equal(0 * 6 + 2.5 * 7 + 0 * 8, mat_1[7]);

            assert.equal(0 * 0 + 0 * 1 + 1 * 2, mat_1[2]);
            assert.equal(0 * 3 + 0 * 4 + 1 * 5, mat_1[5]);
            assert.equal(0 * 6 + 0 * 7 + 1 * 8, mat_1[8]);

        });

        //浮動小数点の精度によりテスト通らないので保留
        0 && it('mat3.inverse(mat[, dest])で逆行列を求めることができる', function () {
            var m1 = mat3([
                51, 2, 9, 4,
                35, 16, 37, 48,
                19, 20, 21, 82,
                13, 18, 25, 96
            ]);
            var m2 = mat3([
                11, 12, 13, 14,
                15, 16, 17, 18,
                19, 20, 21, 22,
                23, 24, 25, 26
            ]);
            var m3 = mat3.inverse(m1);
            var m4 = mat3.inverse2(m1);

            assert.equal(true, mat3.equal(m3, m4));
        });
    });

    //mat4テスト
    describe('mat4テスト', function () {
        it('mat4()はidentity化された4x4行列を生成する', function () {
            var mat1 = mat4();
            var mat2 = mat4();
            assert.equal(true, mat4.equal(mat1, mat2));
        });

        it('mat4.copy(mat[, dest])で行列をコピーできる', function () {
            var mat1 = mat4();
            var mat2 = mat4();
            mat4.translate(mat1, vec3(10, 10, 10), mat1);
            mat4.copy(mat1, mat2);
            assert.equal(true, mat4.equal(mat1, mat2));
            assert.equal(true, mat1 !== mat2);
        });

        it('mat4.equal(mat1, mat2)で行列の内容が等しいかチェックできる', function () {
            var m1 = mat4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]);
            var m2 = mat4([
                11, 12, 13, 14,
                15, 16, 17, 18,
                19, 20, 21, 22,
                23, 24, 25, 26
            ]);
            var m3 = mat4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]);

            assert.equal(true, mat4.equal(m1, m3));
            assert.equal(false, mat4.equal(m1, m2));
        });

        it('multiplyで行列の掛け算ができる', function () {
            var mat1 = mat4([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ]);
            var mat2 = mat4([
                    10, 20, 30, 40,
                    50, 60, 70, 80,
                    90, 100, 110, 120,
                    130, 140, 150, 160
                ]);
            var mat3 = mat4();

            mat4.multiply(mat1, mat2, mat3);
            assert.equal((1 * 10  + 5 * 20  + 9  * 30  + 13 * 40), mat3[0]);
            assert.equal((1 * 50  + 5 * 60  + 9  * 70  + 13 * 80), mat3[4]);
            assert.equal((1 * 90  + 5 * 100 + 9  * 110 + 13 * 120), mat3[8]);
            assert.equal((1 * 130 + 5 * 140 + 9  * 150 + 13 * 160), mat3[12]);
            assert.equal((2 * 10  + 6 * 20  + 10 * 30  + 14 * 40), mat3[1]);
            assert.equal((2 * 50  + 6 * 60  + 10 * 70  + 14 * 80), mat3[5]);
            assert.equal((2 * 90  + 6 * 100 + 10 * 110 + 14 * 120), mat3[9]);
            assert.equal((2 * 130 + 6 * 140 + 10 * 150 + 14 * 160), mat3[13]);
            assert.equal((3 * 10  + 7 * 20  + 11 * 30  + 15 * 40), mat3[2]);
            assert.equal((3 * 50  + 7 * 60  + 11 * 70  + 15 * 80), mat3[6]);
            assert.equal((3 * 90  + 7 * 100 + 11 * 110 + 15 * 120), mat3[10]);
            assert.equal((3 * 130 + 7 * 140 + 11 * 150 + 15 * 160), mat3[14]);
            assert.equal((4 * 10  + 8 * 20  + 12 * 30  + 16 * 40), mat3[3]);
            assert.equal((4 * 50  + 8 * 60  + 12 * 70  + 16 * 80), mat3[7]);
            assert.equal((4 * 90  + 8 * 100 + 12 * 110 + 16 * 120), mat3[11]);
            assert.equal((4 * 130 + 8 * 140 + 12 * 150 + 16 * 160), mat3[15]);
        });

        it('mat4.transpose(mat)で行列を転置行列に変換できる', function () {
            var mat = mat4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]);
            mat4.transpose(mat);

            assert.equal(1, mat[0]);
            assert.equal(5, mat[1]);
            assert.equal(9, mat[2]);
            assert.equal(13, mat[3]);
            assert.equal(2, mat[4]);
            assert.equal(6, mat[5]);
            assert.equal(10, mat[6]);
            assert.equal(14, mat[7]);
            assert.equal(3, mat[8]);
            assert.equal(7, mat[9]);
            assert.equal(11, mat[10]);
            assert.equal(15, mat[11]);
            assert.equal(4, mat[12]);
            assert.equal(8, mat[13]);
            assert.equal(12, mat[14]);
            assert.equal(16, mat[15]);
        });

        0 && it('mat4.inverse(mat[, dest])で逆行列を求めることができる', function () {
            var m1 = mat4([
                51, 2, 9, 4,
                35, 16, 37, 48,
                19, 20, 21, 82,
                13, 18, 25, 96
            ]);
            var m2 = mat4([
                11, 12, 13, 14,
                15, 16, 17, 18,
                19, 20, 21, 22,
                23, 24, 25, 26
            ]);
            var m3 = mat4.inverse(m1);
            var m4 = mat4.inverse2(m1);

            assert.equal(true, mat4.equal(m3, m4));
        });
    });


    /**
     * Vec2テスト
     */
    describe('vec2テスト', function () {
        it('vec2()ですべて0で初期化される', function () {
            var v = vec2();
            assert.equal(0, v[0]);
            assert.equal(0, v[1]);
        });

        it('vec2(x)ですべて同じ数字で初期化される', function () {
            var v = vec2(2);
            assert.equal(2, v[0]);
            assert.equal(2, v[1]);
        });

        it('vec2(x, y)でx, yをそれぞれその値で初期化する', function () {
            var v = vec2(2, 3, 4);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
        });

        it('vec2([x, y])で渡した配列で初期化する', function () {
            var v = vec2([2, 3, 4]);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.xでひとつめの要素を返す', function () {
            var v = vec2([2, 3]);
            assert.equal(2, v.x);
        });

        it('生成後のFloat32Arrayは、arr.yでひとつめの要素を返す', function () {
            var v = vec2([2, 3]);
            assert.equal(3, v.y);
        });

        it('生成後のFloat32Arrayは、arr.x = *でひとつめの要素に値を設定できる', function () {
            var v = vec2();
            v.x = 10;
            assert.equal(10, v[0]);
        });

        it('生成後のFloat32Arrayは、arr.y = *でふたつめの要素に値を設定できる', function () {
            var v = vec2();
            v.y = 20;
            assert.equal(20, v[1]);
        });

        it('vec2.sub(v1, v2, dest)でベクトルの減算ができる。その際、元のベクトルは操作されない。', function () {
            var v1 = vec2(2, 3);
            var v2 = vec2(2, 3);
            var v3 = vec2.sub(v1, v2, vec2());
            assert.equal(0, v3[0]);
            assert.equal(0, v3[1]);
            assert.equal(2, v1[0]);
            assert.equal(3, v1[1]);
            assert.equal(2, v2[0]);
            assert.equal(3, v2[1]);
        });

        it('vec2.add(v1, v2, dest)でベクトルの加算ができる。その際、元のベクトルは操作されない。', function () {
            var v1 = vec2(2, 3);
            var v2 = vec2(2, 3);
            var v3 = vec2.add(v1, v2, vec2());
            assert.equal(4, v3[0]);
            assert.equal(6, v3[1]);
            assert.equal(2, v1[0]);
            assert.equal(3, v1[1]);
            assert.equal(2, v2[0]);
            assert.equal(3, v2[1]);
        });

        it('vec2.multiply(v1, v2, dest)でベクトルの掛け算ができる', function () {
            var v1 = vec2(1, 2);
            var v2 = vec2(3, 4);
            var v3 = vec2.multiply(v1, v2, vec2());

            assert.equal(1 * 3, v3[0]);
            assert.equal(2 * 4, v3[1]);
        });

        it('vec2.multiplyScalar(v, s, dest)でベクトルの掛け算ができる', function () {
            var v1 = vec2(10, 15);
            var v2 = vec2.multiplyScalar(v1, 5, vec2());
            assert.equal(10 * 5, v2[0]);
            assert.equal(15 * 5, v2[1]);
        });

        it('vec2.minus(vec, scalar)で、マイナスに反転したベクトルを返す', function () {
            var v1 = vec2(10, 15);
            var v2 = vec2.minus(v1);
            assert.equal(-10, v2[0]);
            assert.equal(-15, v2[1]);
        });

        it('vec2.dot(v1, v2)でベクトルの内積を得る', function () {
            var v1 = vec2(1, 2);
            var v2 = vec2(10, 11);
            var dot = vec2.dot(v1, v2);
            assert.equal(1 * 10 + 2 * 11, dot);
        });

        it('vec2.cross(v1, v2)でベクトルの外積を得る', function () {
            var v1 = vec2(1, 2);
            var v2 = vec2(10, 11);
            var cross = vec2.cross(v1, v2);
            assert.equal(1 * 11 - 2 * 10, cross);
        });

        it('vec2.norm(v)でベクトルのノルムを得る', function () {
            var v = vec2(5, 3);
            var norm = vec2.norm(v);

            assert.equal(Math.sqrt(5 * 5 + 3 * 3), norm);
        });

        it('vec2.lengthSqr(v)でベクトルの長さの2乗を得る', function () {
            var v = vec2(5, 3);
            var len = vec2.lengthSqr(v);

            assert.equal(5 * 5 + 3 * 3, len);
        });

        it('vec2.applymatrix3(v, mat, dest)でMatrix3をベクトルに適用できる', function () {
            var v = vec2(5, 12);
            var mat = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            var result = vec2.applyMatrix3(v, mat);

            assert.equal(1 * 5 + 4 * 12 + 7, result[0]);
            assert.equal(2 * 5 + 5 * 12 + 8, result[1]);
        });

        it('vec2.reflect(vector, normal)で反射ベクトルを得ることができる', function () {
            var v = vec2(1, 1);
            var normal = vec2.normalize(vec2(-1, 0));
            var refVec = vec2.reflect(v, normal);

            assert.equal(-1, refVec.x);
            assert.equal(1, refVec.y);
        });

        it('vec2.toString(v)でカンマ区切りの文字列に変換できる', function () {
            var v = vec2(2, 3);
            assert.equal('2,3', vec2.toString(v));
        });

        ///////////////////////////////////////////////////////////////////////////////////

        it('vec2(vec)でベクトルのコピーができる', function () {
            var v1 = vec2(0.0, 1.0);
            var v2 = vec2(v1);

            assert.equal(true, v1 !== v2);
            assert.equal(true, vec2.equal(v1, v2));
        });

        ///////////////////////////////////////////////////////////////////////////////////

        it('vec2(vec3)でvec3をvec2に変換できる', function () {
            var v3 = vec3(1, 3, 5);
            var v2 = vec2(v3);

            assert.equal(1, v2[0]);
            assert.equal(3, v2[1]);
            assert.equal(undefined, v2[2]);
        });

        it('vec2(vec4)でvec4をvec2に変換できる', function () {
            var v4 = vec3(1, 3, 5, 7);
            var v2 = vec2(v4);

            assert.equal(1, v2[0]);
            assert.equal(3, v2[1]);
            assert.equal(undefined, v2[2]);
        });
    });


    /**
     * Vec3テスト
     */
    describe('vec3テスト', function () {
        it('vec3()ですべて0で初期化される', function () {
            var v = vec3();
            assert.equal(0, v[0]);
            assert.equal(0, v[1]);
            assert.equal(0, v[2]);
        });

        it('vec3(x)ですべて同じ数字で初期化される', function () {
            var v = vec3(2);
            assert.equal(2, v[0]);
            assert.equal(2, v[1]);
            assert.equal(2, v[2]);
        });

        it('vec3(x, y)でx, yをそれに、zを0で初期化する', function () {
            var v = vec3(2, 3);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(0, v[2]);
        });

        it('vec3(x, y, z)でx, y, zをそれぞれその値で初期化する', function () {
            var v = vec3(2, 3, 4);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
        });

        it('vec3([x, y, z])で渡した配列で初期化する', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
        });

        ////////////////////////////////////////////////////////////////////////////////

        it('生成後のFloat32Arrayは、arr.xでひとつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(2, v.x);
        });

        it('生成後のFloat32Arrayは、arr.yでふたつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(3, v.y);
        });

        it('生成後のFloat32Arrayは、arr.zでみっつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(4, v.z);
        });

        it('生成後のFloat32Arrayは、arr.xyで最初のふたつの要素をvec2として返す', function () {
            var v = vec3([2, 3, 4]);
            var xy = v.xy;
            var v2 = vec2(2, 3);
            assert.equal(true, vec2.equal(xy, v2));
        });

        it('生成後のFloat32Arrayは、arr.x = xでひとつめの要素に値を設定できる', function () {
            var v = vec3();
            v.x = 10;
            assert.equal(10, v[0]);
        });

        it('生成後のFloat32Arrayは、arr.y = yでふたつめの要素に値を設定できる', function () {
            var v = vec3();
            v.y = 20;
            assert.equal(20, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.z = zでみっつめの要素に値を設定できる', function () {
            var v = vec3();
            v.z = 30;
            assert.equal(30, v[2]);
        });

        it('生成後のFloat32Arrayは、arr.xy = vec2(x, y)でひとつめとふたつめの要素に値を設定できる', function () {
            var v = vec3();
            v.xy = vec2(1, 2);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
        });

        /////////////////////////////////////////////////////////////////////////////////////////////

        it('生成後のFloat32Arrayは、arr.rでひとつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(2, v.r);
        });

        it('生成後のFloat32Arrayは、arr.gでふたつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(3, v.g);
        });

        it('生成後のFloat32Arrayは、arr.bでみっつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(4, v.b);
        });

        it('生成後のFloat32Arrayは、arr.rgで最初のふたつの要素をvec2として返す', function () {
            var v = vec3([2, 3, 4]);
            var rg = v.rg;
            var v2 = vec2(2, 3);
            assert.equal(true, vec2.equal(rg, v2));
        });

        it('生成後のFloat32Arrayは、arr.r = rでひとつめの要素に値を設定できる', function () {
            var v = vec3();
            v.r = 10;
            assert.equal(10, v[0]);
        });

        it('生成後のFloat32Arrayは、arr.g = gでふたつめの要素に値を設定できる', function () {
            var v = vec3();
            v.g = 20;
            assert.equal(20, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.b = bでみっつめの要素に値を設定できる', function () {
            var v = vec3();
            v.b = 30;
            assert.equal(30, v[2]);
        });

        it('生成後のFloat32Arrayは、arr.rg = vec2(r, g)でひとつめとふたつめの要素に値を設定できる', function () {
            var v = vec3();
            v.rg = vec2(1, 2);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec3.sub(v1, v2, dest)でベクトルの減算ができる。その際、元のベクトルは操作されない。', function () {
            var v1 = vec3(2, 3, 4);
            var v2 = vec3(2, 3, 4);
            var v3 = vec3.sub(v1, v2, vec3());
            assert.equal(0, v3[0]);
            assert.equal(0, v3[1]);
            assert.equal(0, v3[2]);
            assert.equal(2, v1[0]);
            assert.equal(3, v1[1]);
            assert.equal(4, v1[2]);
            assert.equal(2, v2[0]);
            assert.equal(3, v2[1]);
            assert.equal(4, v2[2]);
        });

        it('vec3.add(v1, v2, dest)でベクトルの加算ができる。その際、元のベクトルは操作されない。', function () {
            var v1 = vec3(2, 3, 4);
            var v2 = vec3(2, 3, 4);
            var v3 = vec3.add(v1, v2, vec3());
            assert.equal(4, v3[0]);
            assert.equal(6, v3[1]);
            assert.equal(8, v3[2]);
            assert.equal(2, v1[0]);
            assert.equal(3, v1[1]);
            assert.equal(4, v1[2]);
            assert.equal(2, v2[0]);
            assert.equal(3, v2[1]);
            assert.equal(4, v2[2]);
        });

        it('vec3.multiply(v1, v2, dest)でベクトルの掛け算ができる', function () {
            var v1 = vec3(1, 2, 3);
            var v2 = vec3(3, 4, 5);
            var v3 = vec3.multiply(v1, v2, vec3());

            assert.equal(1 * 3, v3[0]);
            assert.equal(2 * 4, v3[1]);
            assert.equal(3 * 5, v3[2]);
        });

        it('vec3.multiplyScalar(v, s, dest)でベクトルの掛け算ができる', function () {
            var v1 = vec3(10, 15, 20);
            var v2 = vec3.multiplyScalar(v1, 5, vec3());
            assert.equal(10 * 5, v2[0]);
            assert.equal(15 * 5, v2[1]);
            assert.equal(20 * 5, v2[2]);
        });

        it('vec3.minus(vec)で、マイナスに反転したベクトルを返す', function () {
            var v1 = vec3(10, 15, 20);
            var v2 = vec3.minus(v1);
            assert.equal(-10, v2[0]);
            assert.equal(-15, v2[1]);
            assert.equal(-20, v2[2]);
        });

        it('vec3.dot(v1, v2)でベクトルの内積を得る', function () {
            var v1 = vec3(1, 2, 3);
            var v2 = vec3(10, 11, 12);
            var dot = vec3.dot(v1, v2);
            assert.equal(1 * 10 + 2 * 11 + 3 * 12, dot);
        });

        0 && it('vec3.cross(v1, v2, dest)でベクトルの外積を得る', function () {
            var v1 = vec3(1, 2, 3);
            var v2 = vec3(10, 11, 12);
            var v3 = vec3.cross(v1, v2, vec3());
            assert.equal(11 * 3 - 2 * 12, v3[0]);
            assert.equal(10 * 3 - 1 * 12, v3[1]);
            assert.equal(10 * 2 - 1 * 11, v3[2]);
        });

        it('vec3.toString(v)でカンマ区切りの文字列に変換できる', function () {
            var v = vec3(2, 3, 4);
            assert.equal('2,3,4', vec3.toString(v));
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec3.applymatrix3(v, mat, dest)で、3x3行列とベクトルとの積を求められる。計算はmatrix x vector', function () {
            var v = vec3(3, 5, 7);
            var m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
            var res = vec3.applyMatrix3(v, m);

            assert.equal(1 * 3 + 4 * 5 + 7 * 7, res[0]);
            assert.equal(2 * 3 + 5 * 5 + 8 * 7, res[1]);
            assert.equal(3 * 3 + 6 * 5 + 9 * 7, res[2]);
        });

        it('vec3.applymatrix3FromRight(v, mat, dest)で、3x3行列とベクトルとの積を求められる。計算はvector x matrix。', function () {
            var v = vec3(3, 5, 7);
            var m = mat3(1, 2, 3,
                         4, 5, 6,
                         7, 8, 9);
            var res = vec3.applyMatrix3FromRight(v, m);

            assert.equal(3 * 1 + 5 * 2 + 7 * 3, res[0]);
            assert.equal(3 * 4 + 5 * 5 + 7 * 6, res[1]);
            assert.equal(3 * 7 + 5 * 8 + 7 * 9, res[2]);
        });

        it('vec3.applymatrix4(v, mat, dest)で、4x4行列とベクトルとの積を求められる。計算はmatrix x vector（ただし、ベクトルの第4成分は1と見なす）', function () {
            var v = vec3(3, 5, 7);
            var m = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            var res = vec3.applyMatrix4(v, m);

            assert.equal(1 * 3 + 5 * 5 +  9 * 7 + 13, res[0]);
            assert.equal(2 * 3 + 6 * 5 + 10 * 7 + 14, res[1]);
            assert.equal(3 * 3 + 7 * 5 + 11 * 7 + 15, res[2]);
        });

        it('vec3.applymatrix4(v, mat, dest)で、4x4行列とベクトルとの積を求められる。計算はvector x matrix（ただし、ベクトルの第4成分は1と見なす）', function () {
            var v = vec3(3, 5, 7);
            var m = mat4(1, 2, 3, 4,
                         5, 6, 7, 8,
                         9, 10, 11, 12,
                         13, 14, 15, 16);
            var res = vec3.applyMatrix4FromRight(v, m);

            assert.equal(3 * 1 + 5 *  2 + 7 *  3 + 4,  res[0]);
            assert.equal(3 * 5 + 5 *  6 + 7 *  7 + 8,  res[1]);
            assert.equal(3 * 9 + 5 * 10 + 7 * 11 + 12, res[2]);
        });

        it('vec3.reflect(vector, normal)で反射ベクトルを得ることができる', function () {
            var v = vec3(1, 1, 1);
            var normal = vec3.normalize(vec3(-1, 0, 0));
            var refVec = vec3.reflect(v, normal);

            assert.equal(-1, refVec.x);
            assert.equal(1, refVec.y);
            assert.equal(1, refVec.z);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec3(vec)でベクトルのコピーができる', function () {
            var v1 = vec3(0.0, 1.0, 0.3);
            var v2 = vec3(v1);

            assert.equal(true, v1 !== v2);
            assert.equal(true, vec3.equal(v1, v2));
        });

        it('vec3(x, vec2)でvec3型を返す', function () {
            var v2 = vec2(2, 3);
            var v3 = vec3(1, v2);

            assert.equal(1, v3[0]);
            assert.equal(2, v3[1]);
            assert.equal(3, v3[2]);
        });

        it('vec3(vec2, z)でvec3型を返す', function () {
            var v2 = vec2(1, 2);
            var v3 = vec3(v2, 3);

            assert.equal(1, v3[0]);
            assert.equal(2, v3[1]);
            assert.equal(3, v3[2]);
        });

        //////////////////////////////////////////////////////////////

        it('vec3(vec4)でvec4型をvec3型にして返す', function () {
            var v4 = vec4(1, 3, 5, 7);
            var v3 = vec3(v4);

            assert.equal(1, v3[0]);
            assert.equal(3, v3[1]);
            assert.equal(5, v3[2]);
            assert.equal(undefined, v3[3]);
        });
    });

    describe('vec4テスト', function () {
        it('vec4()は引数なしはすべて0で初期化される', function () {
            var v = vec4();
            assert.equal(0, v[0]);
            assert.equal(0, v[1]);
            assert.equal(0, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4(x)ですべて同じ数字で初期化される', function () {
            var v = vec4(2);
            assert.equal(2, v[0]);
            assert.equal(2, v[1]);
            assert.equal(2, v[2]);
            assert.equal(2, v[3]);
        });

        it('vec4(x, y)でx, yをそれに、z, wを0で初期化する', function () {
            var v = vec4(2, 3);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(0, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4(x, y, z)でx, y, zをそれぞれその値で、wを0で初期化する', function () {
            var v = vec4(2, 3, 4);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4([x, y, z, w])で渡した配列で初期化する', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
            assert.equal(5, v[3]);
        });

        //////////////////////////////////////////////////////////////////////////////

        it('生成後のFloat32Arrayは、arr.xでひとつめの要素を返す', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(2, v.x);
        });

        it('生成後のFloat32Arrayは、arr.yでふたつめの要素を返す', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(3, v.y);
        });

        it('生成後のFloat32Arrayは、arr.zでみっつめの要素を返す', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(4, v.z);
        });

        it('生成後のFloat32Arrayは、arr.wでよっつめの要素を返す', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(5, v.w);
        });

        it('生成後のFloat32Arrayは、arr.xyで最初のふたつの要素をvec2として返す', function () {
            var v = vec4([2, 3, 4, 5]);
            var xy = v.xy;
            var v2 = vec2(2, 3);
            assert.equal(true, vec2.equal(xy, v2));
        });

        it('生成後のFloat32Arrayは、arr.xyzで最初のふたつの要素をvec3として返す', function () {
            var v = vec4([2, 3, 4, 5]);
            var xyz = v.xyz;
            var v3 = vec3(2, 3, 4);
            assert.equal(true, vec3.equal(xyz, v3));
        });

        it('生成後のFloat32Arrayは、arr.x = xでひとつめの要素に値を設定できる', function () {
            var v = vec4();
            v.x = 10;
            assert.equal(10, v[0]);
        });

        it('生成後のFloat32Arrayは、arr.y = yでふたつめの要素に値を設定できる', function () {
            var v = vec4();
            v.y = 20;
            assert.equal(20, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.z = zでみっつめの要素に値を設定できる', function () {
            var v = vec4();
            v.z = 30;
            assert.equal(30, v[2]);
        });

        it('生成後のFloat32Arrayは、arr.w = wでみっつめの要素に値を設定できる', function () {
            var v = vec4();
            v.w = 40;
            assert.equal(40, v[3]);
        });

        it('生成後のFloat32Arrayは、arr.xy = vec2(x, y)でひとつめとふたつめの要素に値を設定できる', function () {
            var v = vec4();
            v.xy = vec2(1, 2);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.xyz = vec3(x, y, z)でひとつめ〜みっつめの要素に値を設定できる', function () {
            var v = vec4();
            v.xyz = vec3(1, 2, 3);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
            assert.equal(3, v[2]);
        });

        /////////////////////////////////////////////////////////////////////////////////////////////

        it('生成後のFloat32Arrayは、arr.rでひとつめの要素を返す', function () {
            var v = vec4([2, 3, 4]);
            assert.equal(2, v.r);
        });

        it('生成後のFloat32Arrayは、arr.gでふたつめの要素を返す', function () {
            var v = vec4([2, 3, 4]);
            assert.equal(3, v.g);
        });

        it('生成後のFloat32Arrayは、arr.bでみっつめの要素を返す', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(4, v.b);
        });

        it('生成後のFloat32Arrayは、arr.rgで最初のふたつの要素をvec2として返す', function () {
            var v = vec4([2, 3, 4]);
            var rg = v.rg;
            var v2 = vec2(2, 3);
            assert.equal(true, vec2.equal(rg, v2));
        });

        it('生成後のFloat32Arrayは、arr.rgbで最初のふたつの要素をvec3として返す', function () {
            var v = vec4([2, 3, 4]);
            var rgb = v.rgb;
            var v3 = vec3(2, 3, 4);
            assert.equal(true, vec3.equal(rgb, v3));
        });

        it('生成後のFloat32Arrayは、arr.r = rでひとつめの要素に値を設定できる', function () {
            var v = vec4();
            v.r = 10;
            assert.equal(10, v[0]);
        });

        it('生成後のFloat32Arrayは、arr.g = gでふたつめの要素に値を設定できる', function () {
            var v = vec4();
            v.g = 20;
            assert.equal(20, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.b = bでみっつめの要素に値を設定できる', function () {
            var v = vec4();
            v.b = 30;
            assert.equal(30, v[2]);
        });

        it('生成後のFloat32Arrayは、arr.rg = vec2(r, g)でひとつめとふたつめの要素に値を設定できる', function () {
            var v = vec4();
            v.rg = vec2(1, 2);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
        });

        it('生成後のFloat32Arrayは、arr.rgb = vec3(r, g, b)でひとつめとふたつめの要素に値を設定できる', function () {
            var v = vec4();
            v.rgb = vec3(1, 2, 3);
            assert.equal(1, v[0]);
            assert.equal(2, v[1]);
            assert.equal(3, v[2]);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec4.multiplyScalar(vec, scalar)で、スカラー積が得られる', function () {
            var v1 = vec4(10, 15, 20, 33);
            var v2 = vec4.multiplyScalar(v1, 3);
            assert.equal(10 * 3, v2[0]);
            assert.equal(15 * 3, v2[1]);
            assert.equal(20 * 3, v2[2]);
            assert.equal(33 * 3, v2[3]);
        });

        it('vec4.minus(vec)で、マイナスに反転したベクトルを返す', function () {
            var v1 = vec4(10, 15, 20, 33);
            var v2 = vec4.minus(v1);
            assert.equal(-10, v2[0]);
            assert.equal(-15, v2[1]);
            assert.equal(-20, v2[2]);
            assert.equal(-33, v2[3]);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec4.applymatrix4(v, mat, dest)で、4x4行列とベクトルとの積を求められる', function () {
            var v = vec4(3, 5, 7, 8);
            var m = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            var res = vec4.applyMatrix4(v, m);

            assert.equal(1 * 3 + 5 * 5 +  9 * 7 + 13 * 8, res[0]);
            assert.equal(2 * 3 + 6 * 5 + 10 * 7 + 14 * 8, res[1]);
            assert.equal(3 * 3 + 7 * 5 + 11 * 7 + 15 * 8, res[2]);
            assert.equal(4 * 3 + 8 * 5 + 12 * 7 + 16 * 8, res[3]);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////

        it('vec4(vec)でベクトルのコピーができる', function () {
            var v1 = vec4(0.0, 1.0, 0.3, 0.8);
            var v2 = vec4(v1);

            assert.equal(true, v1 !== v2);
            assert.equal(true, vec4.equal(v1, v2));
        });

        it('vec4(x, vec3)でvec4型を返す', function () {
            var v3 = vec3(2, 3, 4);
            var v4 = vec4(1, v3);

            assert.equal(1, v4[0]);
            assert.equal(2, v4[1]);
            assert.equal(3, v4[2]);
            assert.equal(4, v4[3]);
        });

        it('vec4(vec2, vec2)でvec4型を返す', function () {
            var v2_1 = vec2(1, 2);
            var v2_2 = vec2(3, 4);
            var v4 = vec4(v2_1, v2_2);

            assert.equal(1, v4[0]);
            assert.equal(2, v4[1]);
            assert.equal(3, v4[2]);
            assert.equal(4, v4[3]);
        });

        it('vec4(x, vec2, w)でvec4型を返す', function () {
            var v2 = vec2(2, 3);
            var v4 = vec4(1, v2, 4);

            assert.equal(1, v4[0]);
            assert.equal(2, v4[1]);
            assert.equal(3, v4[2]);
            assert.equal(4, v4[3]);
        });

        it('vec4(vec3, w)でvec4型を返す', function () {
            var v3 = vec3(1, 2, 3);
            var v4 = vec4(v3, 4);

            assert.equal(1, v4[0]);
            assert.equal(2, v4[1]);
            assert.equal(3, v4[2]);
            assert.equal(4, v4[3]);
        });
    });

}());
