import { MODULE_ID } from "../settings.js";

export function deselectTokens(canvas){
    if (game.user.isGM) return;
    canvas.tokens.releaseAll();
}