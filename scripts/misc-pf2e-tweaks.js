import { registerSettings, MODULE_ID } from "./settings.js";

Hooks.on('init', () => {
    registerSettings();
})

Hooks.on('preUpdateActor', ( actor, changes, options, id) => {
    if(game.settings.get(MODULE_ID, 'bleedReminder')){
        if(!changes.system?.attributes?.hp?.value) return;
        const maxHp = actor.system.attributes.hp.max;
        const newHp = changes.system.attributes.hp.value;
        const healedToFull = newHp >= maxHp;
        const bleedCondition = actor.conditions.stored.find(c => c.system?.persistent?.damageType === "bleed");
        if (healedToFull && bleedCondition) sendBleedReminder(actor);
    }
})

function sendBleedReminder(actor){
    ChatMessage.create({
        content: `${actor.name} has healed to full. Don't forget to remove the persistent bleed damage!`,
        speaker: ChatMessage.getSpeaker({actor: actor}),
        whisper: Object.keys(actor.ownership).filter(x => x !== "default" && actor.ownership[x] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
    });
}