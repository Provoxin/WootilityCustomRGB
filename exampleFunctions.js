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