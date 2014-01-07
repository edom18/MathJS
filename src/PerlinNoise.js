(function (win, doc, exports) {

    'use strict';

    function Xorshift(seed) {

        var i, t, vec, w, x, y, z, _i;

        if (seed == null) {
            seed = +new Date();
        }

        x = 123456789;
        y = 362436069;
        z = 521288629;
        w = 88675123;
        t = 0;
        vec = [1812433254, 3713160357, 3109174145, 64984499];

        for (i = _i = 0; _i <= 4; i = ++_i) {
            vec[i - 1] = seed = 1812433253 * (seed ^ (seed >> 30)) + i;
        }

        this.random = function() {
            var _ref;
            t = vec[0];
            w = vec[3];
            _ref = [vec[1], vec[2], w], vec[0] = _ref[0], vec[1] = _ref[1], vec[2] = _ref[2];
            t ^= t << 11;
            t ^= t >> 8;
            w ^= w >> 19;
            w ^= t;
            vec[3] = w;
            return w * 2.3283064365386963e-10;
        };
    }

    ////////////////////////////////

    function PerlinNoise(seed, octave) {
        var i, p, _i, _j, _p;

        this.octave = octave != null ? octave : 1;

        random = new Xorshift(seed).random;

        _p = [];
        for (i = _i = 0; _i < 256; i = ++_i) {
            _p[i] = floor(random() * 256);
        }

        p = new Array(512);

        for (i = _j = 0; _j < 512; i = ++_j) {
            p[i] = _p[i & 255];
        }

        this.p = p;
    }

    PerlinNoise.prototype._noise = function(x, y, z) {
        var A, AA, AB, B, BA, BB, X, Y, Z, p, u, v, w;
        if (y == null) {
            y = 0;
        }
        if (z == null) {
            z = 0;
        }
        X = floor(x) & 255;
        Y = floor(y) & 255;
        Z = floor(z) & 255;
        x -= floor(x);
        y -= floor(y);
        z -= floor(z);
        u = this.fade(x);
        v = this.fade(y);
        w = this.fade(z);
        p = this.p;
        A = p[X + 0] + Y;
        AA = p[A] + Z;
        AB = p[A + 1] + Z;
        B = p[X + 1] + Y;
        BA = p[B] + Z;
        BB = p[B + 1] + Z;
        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA + 0], x + 0, y + 0, z + 0), this.grad(p[BA + 0], x - 1, y + 0, z + 0)), this.lerp(u, this.grad(p[AB + 0], x + 0, y - 1, z + 0), this.grad(p[BB + 0], x - 1, y - 1, z + 0))), this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x + 0, y + 0, z - 1), this.grad(p[BA + 1], x - 1, y + 0, z - 1)), this.lerp(u, this.grad(p[AB + 1], x + 0, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    };

    PerlinNoise.prototype.fade = function(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    };

    PerlinNoise.prototype.lerp = function(t, a, b) {
        return a + t * (b - a);
    };

    PerlinNoise.prototype.grad = function(hash, x, y, z) {
        var h, u, v;
        h = hash & 15;
        u = h < 8 ? x : y;
        v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    PerlinNoise.prototype.octaves = function(octave) {
        if (octave) {
            return this.octave = octave;
        } else {
            return this.octave;
        }
    };

    PerlinNoise.prototype.noise = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        switch (args.length) {
            case 1:
                return this.octaveNoise1.apply(this, arguments);
            case 2:
                return this.octaveNoise2.apply(this, arguments);
            case 3:
                return this.octaveNoise3.apply(this, arguments);
        }
    };

    PerlinNoise.prototype.octaveNoise1 = function(x) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x) * amp;
            x *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    PerlinNoise.prototype.octaveNoise2 = function(x, y) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x, y) * amp;
            x *= 2.0;
            y *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    PerlinNoise.prototype.octaveNoise3 = function(x, y, z) {
        var amp, i, result, _i, _ref;
        result = 0.0;
        amp = 1.0;
        for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            result += this._noise(x, y, z) * amp;
            x *= 2.0;
            y *= 2.0;
            z *= 2.0;
            amp *= 0.5;
        }
        return result;
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.PerlinNoise = PerlinNoise;
    exports.Xorshift = Xorshift;

}(window, document, window));
