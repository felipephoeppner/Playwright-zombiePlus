import { expect } from "@playwright/test";

export class MoviePage {
  constructor(page) {
    this.page = page;
  }

  async isLoggedIn() {
    await this.page.waitForLoadState("networkidle"); //Todo trafego de rede foi finalizado
    await expect(this.page).toHaveURL(/.*admin/);
  }

  async createMovie(title, overview, company, release_year) {
    await this.page.locator('a[href$="register"]').click();
    await this.page.getByLabel("Titulo do filme").fill(title); //input[name='title']
    await this.page.getByLabel("Sinopse").fill(overview); //input[name='title']

    await this.page
      .locator("#select_company_id .react-select__indicators")
      .click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: company })
      .click();

    await this.page
      .locator("#select_year .react-select__indicators")
      .click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: release_year })
      .click();

    await this.page.getByRole('button', {name:'Cadastrar'}).click();
  }
}
