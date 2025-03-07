export const MODULE_ID = 'misc-pf2e-tweaks';

export function registerSettings() {

    game.settings.register(MODULE_ID, 'bleedReminder', {
        name: "Enable Bleed Reminders",
        hint: "Whispers a message in chat reminding you to remove persistent bleed damage when an actor is healed to full health.",
        scope: 'world',
        default: true,
        type: Boolean,
        config: true
    });
}