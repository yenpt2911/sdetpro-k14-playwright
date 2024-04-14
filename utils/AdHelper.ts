import { Page } from "@playwright/test";

export async function getAdParams(page: Page, adSlot: String) {
    return await page.evaluate(adSlot => {
        const slot = googletag.pubads().getSlots().find(({ getSlotElementId }) => getSlotElementId() === adSlot);
        return slot.getTargetingMap();
    }, adSlot);
}