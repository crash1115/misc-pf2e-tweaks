export const MODULE_ID = 'misc-pf2e-tweaks';

const DEFAULT_TEXT_TAB_LABELS = {
    character: "CHAR",
    actions: "ACT",
    inventory: "INV",
    spellcasting: "SPELL",
    crafting: "CRAFT",
    proficiencies: "PROF",
    feats: "FEAT",
    effects: "EFFECT",
    biography: "BIO",
    pfs: "PFS"
}

const DEFAULT_TAB_CONFIG = {
    useTextTabs: false,
    tabLabels: DEFAULT_TEXT_TAB_LABELS
}


export function registerSettings() {

    game.settings.register(MODULE_ID, 'bleedReminder', {
        name: "Enable Bleed Reminders",
        hint: "Whispers a message in chat reminding you to remove persistent bleed damage when an actor is healed to full health.",
        scope: 'world',
        default: true,
        type: Boolean,
        config: true
    });

    game.settings.register(MODULE_ID, 'sidebarSpeed', {
        name: "Show Speed in PC Sheet Sidebar",
        hint: "When enabled, will display speed in the sidebar of the PC sheets. This is a user-specific setting; changing it only changes it for you.",
        scope: 'client',
        default: false,
        type: Boolean,
        config: true
    });

    game.settings.registerMenu(MODULE_ID, "tabsConfigEditor", {
        name: "Customize PC Sheet Tabs",
        label: "Customize Tabs",
        hint: "Choose to use text instead of icons for PC sheet tabs.",
        icon: "fas fa-wrench",
        type: TabCustomizer,
        restricted: false
    });

    game.settings.register(MODULE_ID, 'tabConfig', {
        scope: 'client',
        config: false,
        type: Object,
        default: DEFAULT_TAB_CONFIG
    }); 
}


const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api
class TabCustomizer extends HandlebarsApplicationMixin(ApplicationV2) {

    constructor(data, options) {
        super(options);
        this.tabConfig = game.settings.get(MODULE_ID, 'tabConfig')
    }

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["misc-pf2e-tweaks"],
        id: "misc-pf2e-tweaks-tab-customizer",
        form: {
            handler: TabCustomizer.myFormHandler,
            submitOnChange: false,
            closeOnSubmit: true
        },
        actions: {
            reset: TabCustomizer.resetLabels
        },
        position: {
            width: 480
        }
    }

    static PARTS = {
        form: {
            template: "modules/misc-pf2e-tweaks/templates/tab-customizer.hbs"
        }
    }

    get title() {
        return "Misc PF2e Tweaks - Customize Tabs";
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.tabConfig = this.tabConfig;
        return context;
    }

    static async myFormHandler(event, form, formData) {
        let newConfig = {
            useTextTabs: formData.object.useTextTabs,
            tabLabels: {
                character: formData.object.character,
                actions: formData.object.actions,
                inventory: formData.object.inventory,
                spellcasting: formData.object.spellcasting,
                crafting: formData.object.crafting,
                proficiencies: formData.object.proficiencies,
                feats: formData.object.feats,
                effects: formData.object.effects,
                biography: formData.object.biography,
                pfs: formData.object.pfs
            }
        }
        await game.settings.set(MODULE_ID, 'tabConfig', newConfig);
        ui.notifications.notify("Tab settings updated. Close and reopen any character sheets for changes to take effect.")
    }

    static async resetLabels(){
        const newConfig = foundry.utils.deepClone(this.tabConfig);
        newConfig.tabLabels = DEFAULT_TEXT_TAB_LABELS;
        this.tabConfig = newConfig;
        this.render();
    }
}