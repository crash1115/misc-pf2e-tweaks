import { MODULE_ID } from "../settings.js";

export async function overrideTabs(app, html, data){
    // Add new class to nav so our custom css kicks in
    const navBar = html[0].querySelector('.sheet-navigation');
    navBar.classList.add('misc-pf2e-tweaks-text-tabs');

    // Delete panel-title
    navBar.querySelector('.panel-title').remove();

    // Define map for labels:
    const tabConfig = game.settings.get(MODULE_ID, 'tabConfig');
    const labelMap = tabConfig.tabLabels;

    // Delete the icons and insert the text into each nav item
    const navTabs = Array.from(navBar.children).filter( el => el.className.includes("item"));
    for(var i = 0; i < navTabs.length; i++){
        const tab = navTabs[i];
        const key = tab.getAttribute('data-tab');
        const newLabel = labelMap[key];
        if(newLabel != ""){
            tab.replaceChildren(newLabel)
        }
    }
}