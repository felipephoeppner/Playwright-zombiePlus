import { test, expect, request} from "../support";
import { faker } from "@faker-js/faker";

/**
 * @type {string}
 */
let leadName;
/**
 * @type {string}
 */
let leadEmail ;

test.beforeEach(async ({ page }) => {
  leadName = faker.person.fullName();
  leadEmail = faker.internet.email();
});

test("deve cadastrar um lead na fila de espera", async ({ page }) => {
  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm(leadName, leadEmail);

  const message =
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!";
  await page.toast.haveText(message);
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

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm(leadName, leadEmail);

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm(leadName, leadEmail);

  const message =
    "O endereço de e-mail fornecido já está registrado em nossa fila de espera.";
  await page.toast.haveText(message);
});

test("Não deve cadastrar um lead com email inválido", async ({ page }) => {
  await page.landing.visit();

  await page.landing.openLeadModal();

  await page.landing.submitLeadForm(leadName, "penha.com.br");

  await page.landing.alertHaveText("Email incorreto");
});

test("Não deve cadastrar quando nome não é preenchido", async ({ page }) => {
  await page.landing.visit();

  await page.landing.openLeadModal();

  await page.landing.submitLeadForm("", leadEmail);

  await page.landing.alertHaveText("Campo obrigatório");
});

test("Não deve cadastrar quando um email não é preenchido", async ({
  page,
}) => {
  await page.landing.visit();

  await page.landing.openLeadModal();

  await page.landing.submitLeadForm(leadName, "");

  await page.landing.alertHaveText("Campo obrigatório");
});
test("Não deve cadastrar quando um email e user não é preenchido", async ({
  page,
}) => {
  await page.landing.visit();

  await page.landing.openLeadModal();

  await page.landing.submitLeadForm("", "");

  await page.landing.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
