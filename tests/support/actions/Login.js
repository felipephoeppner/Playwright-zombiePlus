import { expect } from "@playwright/test";

export class Login {
  constructor(page) {
    this.page = page;
  }


  async do(email, pwd, username){
    await this.visit();
    await this.submit(email, pwd);
    await this.isLoggedIn(username);
  }

  async visit() {
    await this.page.goto("/admin/login");

    const loginForm = this.page.locator(".login-form");
    await expect(loginForm).toBeVisible();
  }

  async submit(email, pwd, ) {
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha").fill(pwd);
    await this.page.getByText("Entrar").click();
  }

  async alertHaveText(text) {
    const alert = this.page.locator("span[class$=alert]");
    await expect(alert).toHaveText(text);
  }

  async isLoggedIn(username) {
    await expect(
      this.page.locator(".logged-user"))
      .toHaveText(`Olá, ${username}`);
  }
}
