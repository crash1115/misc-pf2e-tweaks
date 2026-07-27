import { MODULE_ID } from "../settings.js";

export async function addSpeedsToSidebar(app, html, data){
    const sidebar = html[0].querySelector('.sidebar');
    const customData = {speeds: data.speeds};
    const speedSection = await foundry.applications.handlebars.renderTemplate('modules/misc-pf2e-tweaks/templates/sidebar-speed-section.hbs', customData);
    sidebar.insertAdjacentHTML('beforeend', speedSection);
}