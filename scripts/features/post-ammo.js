export async function postAmmoToChat(context){
    if(!context.type === "attack-roll") return;
    if(!context.actor) return;
    const actor = context.actor;
    if(!actor?.system?.type === "character") return;
    const weapon = context.item;
    const ammo = weapon.ammo;
    if(ammo.system.level > 0){
        ammo.toMessage();
    }
}