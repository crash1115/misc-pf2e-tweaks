import { MODULE_ID } from "../settings.js";

export async function handleCollapsibleSpellEntries(app, html, data){
    // Remove any unnecessary data from the stored setting
    await cleanup(data.actor);

    // Grab each spell entry's HTML element and do stuff to it
    const allSpellEntryElements = html[0].querySelectorAll("li.spellcasting-entry");
    allSpellEntryElements.forEach(async e => {
        // Add the toggle button
        const header = e.querySelector('div.action-header');
        const customData = {};
        const toggle = await foundry.applications.handlebars.renderTemplate('modules/misc-pf2e-tweaks/templates/spell-entry-toggle.hbs', customData);
        header.insertAdjacentHTML('afterbegin', toggle);

        // Add the event listener to the button
        const btn = e.querySelector('a.misc-pf2e-tweaks-toggle');
        btn.addEventListener("click", async ev => {
            await toggleSection(data.actor._id, e.dataset.itemId);
        }); 

        // Hide the entry if it's collapsed
        const settingData = game.settings.get(MODULE_ID, 'collapsedSpellEntries');
        const toCollapse = settingData[data.actor._id] || [];
        if(toCollapse.includes(e.dataset.itemId)){
            e.classList.add("misc-pf2e-tweaks-collapsed");
        }
    });
}

async function toggleSection(actorId, sectionId){
    let collapsedSections = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'collapsedSpellEntries'));
    const actors = Object.keys(collapsedSections);
    // Check if the sheet's actor already has an entry in the setting data
    if(actors.includes(actorId)){
        // It it does, then we add or remove the section id as required
        if(collapsedSections[actorId].includes(sectionId)){     
            collapsedSections[actorId] = collapsedSections[actorId].filter( e => e !== sectionId);
        } else {
            collapsedSections[actorId].push(sectionId)
        }
    } else {
        // If it doesn't, then we add a new key for the actor, and set the value to an array containing the sectionId
        collapsedSections[actorId] = [sectionId];
    }
    await game.settings.set(MODULE_ID,'collapsedSpellEntries',collapsedSections);
    await game.actors.get(actorId).sheet._render(true);
}

async function cleanup(actor){
    // Get a list of the collapsed entries for this actor for the setting
    // Some of these entries might not exist anymore, and we wanna get rid of the ones that don't
    // exist anymore.
    let settingData = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'collapsedSpellEntries'));
    const collapsed = settingData[actor._id] || [];
    if (!collapsed) return;

    // Get a list of casting entry id's that are currently on the actor
    const castingEntriesOnActor = actor.items.filter(i => i.type==="spellcastingEntry");
    const entryIds = castingEntriesOnActor.map( c => c.id);

    // Remove the entries that no longer exist on the actor from the list of entries
    // that should be collapsed
    const purged = collapsed.filter( c => entryIds.includes(c));

    // Update the setting with the cleaned up data
    settingData[actor._id] = purged;
    await game.settings.set(MODULE_ID,'collapsedSpellEntries', settingData);
}