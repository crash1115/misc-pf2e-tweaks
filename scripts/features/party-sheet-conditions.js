import { MODULE_ID } from "../settings.js";

export async function addConditionsToPartySheet(app, html, data){
    const memberActors = data.members.map(m => m.actor);
    memberActors.forEach( async a => {
        const uuid = a.uuid;
        const memberSection = html[0].querySelector(`[data-actor-uuid="${uuid}"]`);
        memberSection.classList.add("pf2e-misc-tweaks");
        const visibleConditions = a.conditions.active.filter( c => c.isIdentified || game.user.isGM);
        const visibleEffects = a.effects.contents.filter( e => e.isIdentified || game.user.isGM);
        const visibleEffectItems = a.items.filter( i => i.type==="effect" && (i.isIdentified || game.user.isGM));
        const customData = {
            conditions: visibleConditions,
            effects: visibleEffects,
            effectItems: visibleEffectItems,
            noEffects: visibleConditions.length + visibleEffectItems.length + visibleEffects.length == 0,
            showDivider1: visibleConditions.length > 0 && + visibleEffectItems.length + visibleEffects.length > 0,
            showDivider2: visibleEffectItems.length > 0 && visibleEffects.length > 0,
            contrastMode: game.settings.get(MODULE_ID, 'partySheetConditions') == "contrast"
        };
        const stats = memberSection.querySelector('.main-stats');
        const conditionSection = await foundry.applications.handlebars.renderTemplate('modules/misc-pf2e-tweaks/templates/party-sheet-conditions.hbs', customData);
        stats.insertAdjacentHTML('afterend', conditionSection);
    });
}