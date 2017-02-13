//解析地址

var l = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function o(A) {
    var z, y, w, u;
    var x, t, v;
    t = A.length;
    x = 0;
    v = "";
    while (x < t) {
        do {
            z = l[A.charCodeAt(x++) & 255]
        } while (x < t && z == -1);
        if (z == -1) {
            break
        }
        do {
            y = l[A.charCodeAt(x++) & 255]
        } while (x < t && y == -1);
        if (y == -1) {
            break
        }
        v += String.fromCharCode((z << 2) | ((y & 48) >> 4));
        do {
            w = A.charCodeAt(x++) & 255;
            if (w == 61) {
                return v
            }
            w = l[w]
        } while (x < t && w == -1);
        if (w == -1) {
            break
        }
        v += String.fromCharCode(((y & 15) << 4) | ((w & 60) >> 2));
        do {
            u = A.charCodeAt(x++) & 255;
            if (u == 61) {
                return v
            }
            u = l[u]
        } while (x < t && u == -1);
        if (u == -1) {
            break
        }
        v += String.fromCharCode(((w & 3) << 6) | u)
    }
    return v
}