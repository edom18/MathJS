(function (win, doc, exports) {
    'use strict';

    function getHue(r, g, b) {
        var h = 0;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        if (r >= g && r >= b) {
            h = 60 * ((g - b) / (max - min));
        }
        else if (g >= r && g >= b) {
            h = 60 * ((b - r) / (max - min)) + 120;
        }
        else if (b >= r && b >= g) {
            h = 60 * ((r - g) / (max - min)) + 240;
        }

        if (h < 0) {
            h += 360;
        }

        return h;
    }

    function getSaturation(r, g, b) {
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        return ((max - min) / max) * 100;
    }

    function getBrightness(r, g, b) {
        var max = Math.max(r, g, b);
        return (max / 255) * 100;
    }

    /**
     * RGBからHSVに変換
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     *
     * return {Object} h, s, v
     */
    function convertRGB2HSV(r, g, b) {
        var h = getHue(r, g, b);
        var s = getSaturation(r, g, b);
        var v = getBrightness(r, g, b);

        return {
            h: h,
            s: s,
            v: v
        };
    }


    ////////////////////////////////////////////////////////////////////////////////////////
    
    function getRange(h, s, b) {
        s = (s / 100) * 255;
        b = (b / 100) * 255;
        
        var max = b;
        var min = max - ((s / 255) * max);
        
        return {
            max: max,
            min: min
        };
    }
    
    /**
     * HSVからRGBに変換
     *
     * @param {number} h
     * @param {number} s
     * @param {number} b
     *
     * return {Object} r, g, b
     */
    function convertHSV2RGB(h, s, v) {
        var r, g, b;
        var range = getRange(h, s, v);
        var max = range.max;
        var min = range.min;
        if (h <= 60) {
            r = max;
            g = (h / 60) * (max - min) + min;
            b = min;
        }
        else if (h <= 120) {
            r = ((120 - h) / 60) * (max - min) + min;
            g = max;
            b = min;
        }
        else if (h <= 180) {
            r = min;
            g = max;
            b = ((h - 120) / 60) * (max - min) + min;
        }
        else if (h <= 240) {
            r = min;
            g = ((240 - h) / 60) * (max - min) + min;
            b = max;
        }
        else if (h <= 300) {
            r = ((h - 240) / 60) * (max - min) + min;
            g = min;
            b = max;
        }
        else {
            r = max;
            g = min;
            b = ((360 - h) / 60) * (max - min) + min;
        }
        
        return {
            r: r,
            g: g,
            b: b
        };
    }
    
    /*!--------------------------------------------------
      EXPORTS
    ----------------------------------------------------- */
    exports.convertHSV2RGB = convertHSV2RGB;
    exports.convertRGB2HSV = convertRGB2HSV;

}(window, document, window));

