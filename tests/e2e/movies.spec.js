import { request, test, expect } from "../support";
import { executeSQL } from "../support/database";

const data = require("../support/fixtures/movies.json");


test("deve poder cadastrar um novo filme", async ({ page }) => {
  //Estar logado
  const movie = data.a_noite_dos_mortos_vivos;
  await executeSQL(`DELETE from movies WHERE title = '${movie.title}';`);

  await page.login.visit();
  await page.login.submit("admin@zombieplus.com", "pwd123");

  await page.movies.isLoggedIn();

  await page.movies.createMovie(
    movie.title,
    movie.overview,
    movie.company,
    movie.release_year,
  );

  await page.toast.haveText("Cadastro realizado com sucesso!");
  //
});
