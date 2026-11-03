import { test, expect, request } from "../support";
import { faker } from "@faker-js/faker";
import { executeSQL } from "../support/database";

/**
 * @type {string}
 */
let leadName;
/**
 * @type {string}
 */
let leadEmail;
test.beforeAll(async () => {
  await executeSQL(`DELETE from leads;`);
});
test.beforeEach(async ({ page }) => {
  leadName = faker.person.fullName();
  leadEmail = faker.internet.email();
});

test("deve cadastrar um lead na fila de espera", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.";
  await page.popup.containText(message);
});

test("não deve cadastrar quando o email já existe", async ({
  page,
  request,
}) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  const response = await request.post("http://localhost:3333/leads", {
    data: {
      name: leadName,
      email: leadEmail,
    },
  });

  expect(response.status()).toBe(201);
  expect(response.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    "Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.";
  await page.popup.containText(message);
});

test("Não deve cadastrar um lead com email inválido", async ({ page }) => {
  await page.leads.visit();

  await page.leads.openLeadModal();

  await page.leads.submitLeadForm(leadName, "penha.com.br");

  await page.leads.alertHaveText("Email incorreto");
});

test("Não deve cadastrar quando nome não é preenchido", async ({ page }) => {
  await page.leads.visit();

  await page.leads.openLeadModal();

  await page.leads.submitLeadForm("", leadEmail);

  await page.leads.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar quando um email não é preenchido", async ({
  page,
}) => {
  await page.leads.visit();

  await page.leads.openLeadModal();

  await page.leads.submitLeadForm(leadName, "");

  await page.leads.alertHaveText("Campo obrigatório");
});
test("Não deve cadastrar quando um email e user não é preenchido", async ({
  page,
}) => {
  await page.leads.visit();

  await page.leads.openLeadModal();

  await page.leads.submitLeadForm("", "");

  await page.leads.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
