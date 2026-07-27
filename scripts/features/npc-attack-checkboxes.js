import { MODULE_ID } from "../settings.js";

export async function handleNpcAttackCheckboxes(app, html, data){
    // Grab each attack's HTML element and do stuff to it
    const strikesList = html[0].querySelector("ol.strikes-list");
    const allAttackElements = strikesList.querySelectorAll("li.item.action");
    allAttackElements.forEach(async e => {
        // Add the checkbox
        const controls = e.querySelector('.controls');
        const settingData = game.settings.get(MODULE_ID, 'checkedNpcAttacks');
        const toCollapse = settingData[app.id] || [];
        const customData = {checked: toCollapse.includes(e.dataset.itemId)};
        const checkbox = await foundry.applications.handlebars.renderTemplate('modules/misc-pf2e-tweaks/templates/npc-attack-checkbox.hbs', customData);
        controls.insertAdjacentHTML('afterbegin', checkbox);

        // Add the event listener to the button
        const box = e.querySelector('input.misc-pf2e-tweaks-npc-attack');
            box.addEventListener("change", async ev => {
            await toggleSection(app.id, e.dataset.itemId);
        });
    });
}

async function toggleSection(sheetId, attackId){
    let checkedAttacks = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'checkedNpcAttacks'));
    const sheets = Object.keys(checkedAttacks);
    // Check if the sheet already has an entry in the setting data
    if(sheets.includes(sheetId)){
        // It it does, then we add or remove the attack id as required
        if(checkedAttacks[sheetId].includes(attackId)){     
            checkedAttacks[sheetId] = checkedAttacks[sheetId].filter( e => e !== attackId);
        } else {
            checkedAttacks[sheetId].push(attackId)
        }
    } else {
        // If it doesn't, then we add a new key for the sheet, and set the value to an array containing the attackId
        checkedAttacks[sheetId] = [attackId];
    }
    await game.settings.set(MODULE_ID,'checkedNpcAttacks',checkedAttacks);
}

export async function removeNpcAttackCheckboxesForScene(id){
    let checkedAttacks = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'checkedNpcAttacks'));
    const keys = Object.keys(checkedAttacks);
    keys.forEach( key => {
        if(key.includes("Scene-"+id)){
            delete checkedAttacks[key];
        }
    })
    await game.settings.set(MODULE_ID,'checkedNpcAttacks',checkedAttacks);
}

export async function removeNpcAttackCheckboxesForActor(id){
    let checkedAttacks = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'checkedNpcAttacks'));
    const keys = Object.keys(checkedAttacks);
    keys.forEach( key => {
        if(key.includes("Actor-"+id)){
            delete checkedAttacks[key];
        }
    })
    await game.settings.set(MODULE_ID,'checkedNpcAttacks',checkedAttacks);
}

export async function removeNpcAttackCheckboxesForToken(id){
    let checkedAttacks = foundry.utils.deepClone(game.settings.get(MODULE_ID, 'checkedNpcAttacks'));
    const keys = Object.keys(checkedAttacks);
    keys.forEach( key => {
        if(key.includes("Token-"+id)){
            delete checkedAttacks[key];
        }
    })
    await game.settings.set(MODULE_ID,'checkedNpcAttacks',checkedAttacks);
}
