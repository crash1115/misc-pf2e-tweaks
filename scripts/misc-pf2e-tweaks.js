import { registerSettings, MODULE_ID } from "./settings.js";

Hooks.on('init', () => {
    registerSettings();
})

Hooks.on('renderCharacterSheetPF2e', ( app, html, data ) => {
    if(game.settings.get(MODULE_ID, 'sidebarSpeed')){
        addSpeedsToSidebar(app, html, data);
    }

    if(game.settings.get(MODULE_ID, 'tabConfig')?.useTextTabs){
        overrideTabs(app, html, data);
    }
});

Hooks.on('preUpdateActor', ( actor, changes, options, id) => {
    if(game.settings.get(MODULE_ID, 'bleedReminder')){
        if(!changes.system?.attributes?.hp?.value) return;
        const maxHp = actor.system.attributes.hp.max;
        const newHp = changes.system.attributes.hp.value;
        const healedToFull = newHp >= maxHp;
        const bleedCondition = actor.conditions.stored.find(c => c.system?.persistent?.damageType === "bleed");
        if (healedToFull && bleedCondition) sendBleedReminder(actor);
    }
});

async function addSpeedsToSidebar(app, html, data){
    const sidebar = html[0].querySelector('.sidebar');
    const customData = {speeds: data.speeds};
    const speedSection = await foundry.applications.handlebars.renderTemplate('modules/misc-pf2e-tweaks/templates/sidebar-speed-section.hbs', customData);
    sidebar.insertAdjacentHTML('beforeend', speedSection);
}

function sendBleedReminder(actor){
    ChatMessage.create({
        content: `${actor.name} has healed to full. Don't forget to remove the persistent bleed damage!`,
        speaker: ChatMessage.getSpeaker({actor: actor}),
        whisper: Object.keys(actor.ownership).filter(x => x !== "default" && actor.ownership[x] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
    });
}

async function overrideTabs(app, html, data){
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