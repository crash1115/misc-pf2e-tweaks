import { registerSettings, MODULE_ID } from "./settings.js";
import { addSpeedsToSidebar } from "./features/sidebar-speeds.js";
import { handleCollapsibleSpellEntries, removeCollapsibleSpellEntriesForActor } from "./features/collapsible-spell-entries.js";
import { addConditionsToPartySheet } from "./features/party-sheet-conditions.js";
import { handleBleedReminder } from "./features/bleed-reminder.js";
import { overrideTabs } from "./features/text-based-tabs.js";
import { tweakConditionsHud } from "./features/tweak-conditions-hud.js";
import { deselectTokens } from "./features/deselect-tokens.js";

Hooks.on('init', () => {
    registerSettings();
})

Hooks.on('renderCharacterSheetPF2e', ( app, html, data ) => {
    if(game.settings.get(MODULE_ID, 'sidebarSpeed')){
        addSpeedsToSidebar(app, html, data);
    }

    if(game.settings.get(MODULE_ID, 'collapseSpellEntries')){
        handleCollapsibleSpellEntries(app, html, data);
    }

    if(game.settings.get(MODULE_ID, 'tabConfig')?.useTextTabs){
        overrideTabs(app, html, data);
    }
});

Hooks.on('renderPartySheetPF2e', ( app, html, data ) => {
    if(["contrast", "on"].includes(game.settings.get(MODULE_ID, 'partySheetConditions'))){
        addConditionsToPartySheet(app, html, data);
    }
});

Hooks.on('preUpdateActor', ( actor, changes, options, id) => {
    if(game.settings.get(MODULE_ID, 'bleedReminder')){
        handleBleedReminder(actor, changes);
    }
});

Hooks.on('deleteActor', ( actor, action, id ) => {
    removeCollapsibleSpellEntriesForActor(actor.id);
});

Hooks.on("renderTokenHUD", (app, html, data, options) => {
    if(game.settings.get(MODULE_ID, 'tweakConditionsHud')){
        tweakConditionsHud(app, html, data, options);
    }
});

Hooks.on('canvasReady', (canvas) => {
    if(game.settings.get(MODULE_ID, 'deSelectTokens')){
        deselectTokens(canvas);
    }
});