import { test, expect } from "../support"

test.beforeEach(async ({ page }) => {

});

test("Deve logar como administrador", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com','pwd123');

    await page.movies.isLoggedIn();
});

test("Não deve logar com senha incorreta", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com','abc123');

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'

    await page.toast.haveText(message);
});
test("Não deve logar quando email é preenchido inválido", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('www.penha.com.br','testes');

    await page.login.alertHaveText('Email incorreto');
});
test("Não deve logar quando email não é preenchido", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('','abc123');

    await page.login.alertHaveText('Campo obrigatório');
});
test("Não deve logar quando pwd não é preenchido", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com','');

    await page.login.alertHaveText('Campo obrigatório');
});

test("Não deve logar quando nenhum é preenchido", async ({ page }) => {
    await page.login.visit();
    await page.login.submit('','');

    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});