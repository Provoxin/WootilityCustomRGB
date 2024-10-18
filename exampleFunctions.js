function matrixdebug(_, matrixPos)
{
    return { red: matrixPos.col % 3 == 0 ? 255 : 0, green: matrixPos.col % 3 == 1 ? 255 : 0, blue: matrixPos.col % 3 == 2 ? 255 : 0 };
}
function xydebug(keyPos)
{
    return { red: keyPos.x * 255, green: 0, blue: 0 };
}
function errortest()
{
    return { red: 0, green: 0, blue: NaN }
}
function random()
{
    return { red: Math.random() * 255, green: Math.random() * 255, blue: Math.random() * 255};
}
function matrixgradient(_, matrixPos)
{
    return { red: 255/(matrix.columns-1) * matrixPos.column, green: 255/(matrix.rows-1) * matrixPos.row, blue: 255-(255/(matrix.columns-1) * matrixPos.column) };
}
function colorwheel(keyPos)
{
    return hsv2rgb({ h: keyPos.x * 360, s: 1-keyPos.y, v: 1 });
}
function hsvgradient(keyPos)
{
    let startCol = rgb2hsv({r: 1, g: 0, b: 2/3});
    let endCol = rgb2hsv({r: 2/3, g: 0, b: 1});
    return hsv2rgb(lerphsv(startCol, endCol, keyPos.x));
}

function lerp(from, to, frac)
{
    return from + (to - from) * frac;
}
function lerphsv(from, to, frac)
{
    return { h: lerp(from.h, to.h, frac), s: lerp(from.s, to.s, frac), v: lerp(from.v, to.v, frac) };
}

function rgb2hsv(rgb)  // https://stackoverflow.com/a/54070620 - {r,g,b} from [0, 1]
{
    let v = Math.max(rgb.r,rgb.g,rgb.b), c=v-Math.min(rgb.r,rgb.g,rgb.b);
    let h = c && ((v==rgb.r) ? (rgb.g-rgb.b)/c : ((v==rgb.g) ? 2+(rgb.b-rgb.r)/c : 4+(rgb.r-rgb.g)/c)); 
    return { h: 60*(h<0?h+6:h), s: v&&c/v, v: v };
}
function hsv2rgb(hsv)  // https://stackoverflow.com/a/54024653 - h from (0, 360], s and v from [0, 1]
{                              
  let f = (n,k=(n+hsv.h/60)%6) => hsv.v - hsv.v*hsv.s*Math.max( Math.min(k,4-k,1), 0);     
  return { red: f(5)*255, green: f(3)*255, blue: f(1)*255 };       
}