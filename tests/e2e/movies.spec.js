import { request, test, expect } from "../support";
import { executeSQL } from "../support/database";

const data = require("../support/fixtures/movies.json");

test.beforeAll(async () => {
  await executeSQL(`DELETE from movies;`);
});

test("deve poder cadastrar um novo filme", async ({ page }) => {
  //Estar logado
  const movie = data.a_noite_dos_mortos_vivos;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.createMovie(movie);

  await page.popup.containText(
    `O filme '${movie.title}' foi adicionado ao catálogo.`,
  );
  //
});

test("Deve poder remover um filme", async ({ page, request }) => {
  const movie = data.dia_dos_mortos;
  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.remove(movie.title);
});

test("nao deve cadastrar quando o campos obrigaiorios nao são preenchidos", async ({
  page,
}) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.goToForm();
  await page.movies.submit();

  await page.movies.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
  ]);
});

test("nao deve poder cadastrar um novo filme duplicado", async ({
  page,
  request,
}) => {
  //Estar logado
  const movie = data.despertar_dos_mortos;

  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.createMovie(movie);
  await page.popup.containText(
    `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`,
  );
});

test("deve realizar buscar pelo termo Zumbi", async ({ page, request
 }) => {
  //Estar logado
  const movies = data.search;

  movies.data.forEach(async (m)=>{
      await request.api.postMovie(m);
  })

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.search(movies.input);
  
  await page.movies.tableHave(movies.outputs);
  //
});
