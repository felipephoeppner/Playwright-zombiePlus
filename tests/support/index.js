const { test: base, expect, request} = require("@playwright/test");

import { LoginPage } from "../pages/LoginPage";
import { MoviePage } from "../pages/MoviePage";
import { Toast } from "../pages/Components";
import { LandingPage } from "../pages/LandingPages";

/**
 * @typedef {Object} PageObjects
 * @property {LandingPage} landing
 * @property {LoginPage} login
 * @property {MoviePage} movies
 * @property {Toast} toast
 */

/**
 * @type {import('@playwright/test').TestType<
 *   import('@playwright/test').PlaywrightTestArgs &
 *   import('@playwright/test').PlaywrightTestOptions &
 *   { page: import('@playwright/test').Page & PageObjects },
 *   import('@playwright/test').PlaywrightWorkerArgs &
 *   import('@playwright/test').PlaywrightWorkerOptions
 * >}
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    Object.assign(page, {
      landing: new LandingPage(page),
      login: new LoginPage(page),
      movies: new MoviePage(page),
      toast: new Toast(page),
    });

    await use(page);
  },
});

export { expect, request }
