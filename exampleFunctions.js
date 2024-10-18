function matrixdebug(keyPos, matrixPos)
{
    return { red: col % 3 == 0 ? 255 : 0, green: col % 3 == 1 ? 255 : 0, blue: col % 3 == 2 ? 255 : 0 };
}
function xydebug(keyPos, matrixPos)
{
    return { red: keyPos.x * 255, green: 0, blue: 0 };
}
function errortest(keyPos, matrixPos)
{
    return { red: 0, green: 0, blue: NaN }
}
function random(keyPos, matrixPos)
{
    return { red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255};
}
function matrixgradient(keyPos, matrixPos)
{
    return { red: 255/(matrix.columns-1) * matrixPos.column, green: 255/(matrix.rows-1) * matrixPos.row, blue: 255-(255/(matrix.columns-1) * matrixPos.column) };
}
function colorwheel(keyPos, matrixPos)
{
    return HSVtoRGB(keyPos.x, 1-keyPos.y, 1);
}

function HSVtoRGB(h, s, v)  // https://stackoverflow.com/a/17243070
{
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        red: r * 255,
        green: g * 255,
        blue: b * 255
    };
}