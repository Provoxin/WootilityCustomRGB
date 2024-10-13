# WootilityCustomRGB

Define per-key RGB on https://wootility.io using javascript.
Userscript (wootility.user.js) created by [Netux](https://github.com/netux).

# Usage
Download or copy the contents of [wootility.user.js](https://github.com/Provoxin/WootilityCustomRGB/blob/main/wootility.user.js) into a userscript extension, such as [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/).
Go to [the Wootility site](https://wootility.io), open the console with F12 or ctrl+shift+i, paste the contents of [setRGB.js](https://github.com/Provoxin/WootilityCustomRGB/blob/main/setRGB.js) into it, and press Enter.
The default function creates a rainbow gradient across the board.
To use a custom function, create a function named `RGBFunction(keyPos, matrixPos)` in the console. It must return a dict containing values for `red`, `green`, and `blue`.
The arguments to the function will give you
- `keyPos`: a dict containing the `.x` and `.y` positions of the current key, ranging from 0-1 (left-right, top-bottom).
- `matrixPos`: a dict containing the `.row` and `.column` of the current key.

After running the script, the keys will update, but will not be saved to the onboard profile. Enter `s()` into the console to confirm you want to overwrite the onboard colors.
If you haven't run `s()`, you can enter `undo()` to revert to the saved color profile.
