import { expect } from "@playwright/test";

export class Movies {
  constructor(page) {
    this.page = page;
  }

  async goToForm() {
    await this.page.locator('a[href$="register"]').click();
  }

  async submit() {
    await this.page.getByRole("button", { name: "Cadastrar" }).click();
  }
  async createMovie(movie) {
    await this.goToForm();
    await this.page.getByLabel("Titulo do filme").fill(movie.title); //input[name='title']
    await this.page.getByLabel("Sinopse").fill(movie.overview); //input[name='title']

    await this.page
      .locator("#select_company_id .react-select__indicators")
      .click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: movie.company })
      .click();

    await this.page.locator("#select_year .react-select__indicators").click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: movie.release_year })
      .click();

    await this.page
      .locator("input[name=cover]")
      .setInputFiles("tests/support/fixtures/" + movie.cover);

    await this.page.locator(".featured .react-switch");

    if (movie.featured) {
      await this.page.locator(".featured .react-switch").click();
    }

    this.submit();
  }

  async search(target) {
    await this.page.getByPlaceholder("Busque pelo nome").fill(target);
    await this.page.click(".actions button");
  }

  async tableHave(content) {
    const rows = this.page.getByRole("row");
    await expect(rows).toContainText(content);
  }

  async remove(title) {
    await this.page
      .getByRole("row", { name: title })
      .getByRole("button")
      .click();
    await this.page.locator(".confirm-removal").click();
  }

  async alertHaveText(target) {
    await expect(this.page.locator(".alert")).toHaveText(target);
  }
}
