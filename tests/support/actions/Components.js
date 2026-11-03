import { expect } from "@playwright/test";

export class popup {
  constructor(page) {
    this.page = page;
  }

  async containText(message) {
    const popup = this.page.locator(".swal2-html-container");

    await expect(popup).toHaveText(message);
  }
}
