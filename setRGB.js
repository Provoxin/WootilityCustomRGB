if (!document.querySelector("button[aria-label='RGB Effects'][aria-selected='true']"))
{
    document.querySelector("button[aria-label='RGB Effects']").click();
    throw "error: wasn't on RGB page - run the script again.";    
}

try
{
    var activeDevice = window.wootilityDeviceManager.activeDevice;
    var settingsControl = activeDevice.globalSettingsControl;
    var colorProfile = activeDevice.rgbControl.activeColorProfile;
}
catch (error)
{
    if (error instanceof TypeError)
    {
        window.wootilityDeviceManager.deviceManager.searchForDevices()
        throw "error: device not initialized - run the script again once it's been found."
    }
    else { throw error; }
}

var ogColorArray = colorProfile.kbdArray;
if (typeof onboardColorArray === "undefined")
{
    onboardColorArray = ogColorArray;
}
colorProfile.kbdArray = window.createLayoutArray();
var matrix = window.getDeviceMatrix(activeDevice.device.keyboardType); // use matrix.columns and matrix.rows to get number of cols and rows
var rgbMap = window.getKeyLayoutReference(activeDevice.device.keyboardType,  // which row,col intersections have addressable rgb
                                            await activeDevice.device.getlayoutType(),
                                            "rgb");

var keysArray = [];
document.querySelectorAll(".keyRender").forEach((k) => { keysArray.push(k) });  // we need this as an array, not a NodeList, to do .map on it
var furthestLeft =   Math.min(...keysArray.map((k) => { return elementCenter(k).x; }));
var furthestRight =  Math.max(...keysArray.map((k) => { return elementCenter(k).x; }));
var furthestTop =    Math.min(...keysArray.map((k) => { return elementCenter(k).y; }));
var furthestBottom = Math.max(...keysArray.map((k) => { return elementCenter(k).y; }));
var kbOffset = { x: furthestLeft, y: furthestTop };
var kbSize = { x: furthestRight - furthestLeft,
               y: furthestBottom - furthestTop };

var rowElements = document.querySelector(".chakra-stack[dir='ltr']").children; 
function elementCenter(element)
{
    let rect = element.getBoundingClientRect();
    return { x: ((rect.left + rect.right) / 2),
             y: ((rect.top + rect.bottom) / 2) };
}

if (typeof RGBFunction === "function") { var chosenFunction = RGBFunction; }
else
{
    var chosenFunction = threeColorGradient;
    console.warn(`No custom function defined - using preset "${chosenFunction.name}"`)
}
for (let row = 0, elementNumber = 0; row < matrix.rows; row++, elementNumber = 0)
{
    for (let col = 0; col < matrix.columns; col++)
    {
        if (rgbMap[row][col] === null) { continue; }  // current row,col isn't addressable
        let key = rowElements[row].children[elementNumber].children[0].children[0];
        if (key === undefined) { break; }  // we've colored all keys in this row
        keyPos = { x: (elementCenter(key).x - kbOffset.x) / kbSize.x,
                   y: (elementCenter(key).y - kbOffset.y) / kbSize.y };
        
        try { colorProfile.kbdArray[row][col] = roundRGB(chosenFunction(keyPos, { row: row, column: col })); }
        catch (error)
        {
            colorProfile.kbdArray = ogColorArray;
            if (error instanceof RangeError)
            {
                throw error.message + ` at\nrow ${row}\ncol ${col}\nx ${keyPos.x}\ny ${keyPos.y}`;
            }
            else { throw error; }
        }
        ++elementNumber;
    }
}

await activeDevice.rgbControl.sendRgbColors(colorProfile.kbdArray, false);
console.warn("Success! Type \"s()\" in console (without quotes) to save.\nType \"undo()\" to load your onboard profile.");

async function s()
{
    await activeDevice.rgbControl.sendRgbColors(colorProfile.kbdArray, true);  // save
    onboardColorArray = colorProfile.kbdArray;
    console.warn("Colors succesfully saved.");
}
async function undo()
{
    await activeDevice.rgbControl.sendRgbColors(onboardColorArray, false);
    colorProfile.kbdArray = onboardColorArray;
    console.warn("Onboard colors loaded.");
}

function roundRGB(rgb)
{
    if (isNaN(rgb.red + rgb.green + rgb.blue)) { throw new RangeError(`invalid color: {r:${rgb.red}, g:${rgb.green}, b:${rgb.blue}}`); }
    return { red:   Math.max(Math.min(Math.round(rgb.red),   255), 0),
             green: Math.max(Math.min(Math.round(rgb.green), 255), 0),
             blue:  Math.max(Math.min(Math.round(rgb.blue),  255), 0) };
}

function threeColorGradient(keyPos, matrixPos)
{
    return { red: keyPos.x * 255, green: 255 * keyPos.y, blue: (1-keyPos.x) * 255 };
}
