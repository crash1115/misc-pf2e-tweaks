import { MODULE_ID } from "../settings.js";

export function tweakConditionsHud(app, html, data, options){
    let conditionHud = document.querySelectorAll('#token-hud')[0];
    conditionHud.classList.add('misc-pf2e-tweaks');
    let conditions = document.querySelectorAll('.effect-control > img');
    for(let img of conditions){
        const label = img.parentNode.getAttribute("aria-label");
        const labelDiv = document.createElement('div');
        labelDiv.classList.add("condition-label")
        labelDiv.innerHTML = label;
        img.insertAdjacentElement("afterend", labelDiv);   
        img.parentNode.removeAttribute('data-tooltip-text'); 
    };
}