// @ts-check
import { test, expect } from "@playwright/test";


test.skip("deve cadastrar um lead na fila de espera", async ({ page }) => {
  await page.goto("/");

  //await page.click('//button[text()="Aperte o play... se tiver coragem"]'); XPATH

  //await page.getByRole('button',{name:'Aperte o play... se tiver coragem'}).click(); STRING COMPLETA

  await page.getByRole("button", { name: /Aperte o play/ }).click(); //SUBSTRING

  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera",
  );

  //await page.locator('#name').fill('Felipe@test.com'); //CSS SELECTOR

  //await page.locator('input[name=name]').fill('Felipe@hotmail.com');

  //await page.locator(`input[placeholder='Informe seu nome']`).fill('Test@penha.com');

  await page.getByPlaceholder("Informe seu nome").fill("Hoeppner Penha");

  //await page.locator('#email').fill('Testing@hotmail.com'); //Encontrar ID email

  await page.locator("input[name=email]").fill("input@email.com");

  // await page.getByRole('button', {name:/Quero entrar na fila!/}).click();

  await page.getByTestId("modal").getByText("Quero entrar na fila!").click();

  await expect(page.locator(".toast")).toHaveText(
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!",
  );
  await expect(page.locator(".toast")).toBeHidden({ timeout: 5000 });

});
test("Não deve cadastrar um lead com email inválido", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: /Aperte o play/ }).click(); //SUBSTRING
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera",
  );

  //await page.getByPlaceholder("Informe seu nome").fill("Hoeppner Penha");

  await page.locator("input[name=email]").fill("input@email.com");

  await page.getByTestId("modal").getByText("Quero entrar na fila!").click();

  await expect(page.getByTestId("modal").locator(".alert")).toHaveText(
    "Campo obrigatório",
  );
});

test("Não deve cadastrar quando nome não é preenchido", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: /Aperte o play/ }).click(); //SUBSTRING
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera",
  );

  //await page.getByPlaceholder("Informe seu nome").fill("Hoeppner Penha");

  await page.locator("input[name=email]").fill("input@email.com");

  await page.getByTestId("modal").getByText("Quero entrar na fila!").click();

  await expect(page.getByTestId("modal").locator(".alert")).toHaveText(
    "Campo obrigatório",
  );
});

test("Não deve cadastrar quando um email não é preenchido", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: /Aperte o play/ }).click(); //SUBSTRING
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera",
  );

  await page.getByPlaceholder("Informe seu nome").fill("Hoeppner Penha");

  //await page.locator("input[name=email]").fill("input@email.com");

  await page.getByTestId("modal").getByText("Quero entrar na fila!").click();

  await expect(page.getByTestId("modal").locator(".alert")).toHaveText(
    "Campo obrigatório",
  );
});
test("Não deve cadastrar quando um email e user não é preenchido", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: /Aperte o play/ }).click(); //SUBSTRING
  await expect(page.getByTestId("modal").getByRole("heading")).toHaveText(
    "Fila de espera",
  );

  await page.getByTestId("modal").getByText("Quero entrar na fila!").click();

  await expect(page.getByTestId("modal").locator(".alert")).toHaveText(
    ["Campo obrigatório","Campo obrigatório"]
  );
});
 
