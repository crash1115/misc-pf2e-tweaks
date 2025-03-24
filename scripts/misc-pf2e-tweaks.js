import { registerSettings, MODULE_ID } from "./settings.js";

Hooks.on('init', () => {
    registerSettings();
})

Hooks.on('renderCharacterSheetPF2e', ( app, html, data ) => {
    if(game.settings.get(MODULE_ID, 'sidebarSpeed')){
        addSpeedsToSidebar(app, html, data);
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
    const sidebar = html.find('.sidebar');
    const customData = {speeds: data.speeds};
    const speedSection = $(await renderTemplate('modules/misc-pf2e-tweaks/templates/sidebar-speed-section.hbs', customData))
    $(sidebar).append(speedSection);

}

function sendBleedReminder(actor){
    ChatMessage.create({
        content: `${actor.name} has healed to full. Don't forget to remove the persistent bleed damage!`,
        speaker: ChatMessage.getSpeaker({actor: actor}),
        whisper: Object.keys(actor.ownership).filter(x => x !== "default" && actor.ownership[x] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
    });
}