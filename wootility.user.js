// ==UserScript==
// @name         Wootility get access to internal functions
// @description  Override v5.wootility.io's main script
// @version      2024-10-09
// @author       Netux
// @match        https://wootility.io/
// @match        https://v5.wootility.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wootility.io
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    const scriptEl = document.querySelector(`head script[type="module"][src^="/assets/index-"]`);
    const afterScriptEl = scriptEl.nextElementSibling;
    scriptEl.remove();

    const ogObjectDefineProperty = Object.defineProperty;
    ogObjectDefineProperty(Object, "defineProperty", {
        get() {
            restoreObjectDefineProperty();
            injectModifiedScript();
            throw "controlled error to make sure original <script> crashes. Please ignore :^)";
        }
    });

    function restoreObjectDefineProperty() {
        ogObjectDefineProperty(Object, "defineProperty", {
            value: ogObjectDefineProperty
        });
    }

    const ogScriptContentPromise = fetch(scriptEl.src).then((res) => res.text());

    async function injectModifiedScript() {
        const ogScriptContent = await ogScriptContentPromise;

        const modifiedScriptEl = document.createElement("script");
        for (const attrName of scriptEl.getAttributeNames()) {
            if (attrName.includes("src")) {
                continue;
            }
            modifiedScriptEl.setAttribute(attrName, scriptEl.getAttribute(attrName));
        }

        let modifiedScriptContent = ogScriptContent;
        modifiedScriptContent = `console.warn("Injected modified script");\n${modifiedScriptContent}`;
        modifiedScriptContent = modifiedScriptContent.replace(
            "const controller=new WootilityDeviceManager(store);",
            `const controller=new WootilityDeviceManager(store);
            window.wootilityDeviceManager = controller;
            console.warn("WootilityDeviceManager found in window.wootilityDeviceManager!", window.wootilityDeviceManager);`
        ).replace(
            ",createLayoutArray=(",
            `; var createLayoutArray; window.createLayoutArray = createLayoutArray=(`
        ).replace(
            "function getDeviceMatrix(eo){",
            `window.getDeviceMatrix = getDeviceMatrix;
            function getDeviceMatrix(eo){`
        ).replace(
            "function selectColorProfile(eo){",
            `window.selectColorProfile = selectColorProfile;
            function selectColorProfile(eo){`
        ).replace(
            "function getKeyLayoutReference(eo,to,no){",
            `window.getKeyLayoutReference = getKeyLayoutReference;
            function getKeyLayoutReference(eo,to,no){`
        );
        modifiedScriptEl.textContent = modifiedScriptContent;

        afterScriptEl.parentElement.insertBefore(modifiedScriptEl, afterScriptEl);
    }
})();
