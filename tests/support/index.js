// @ts-check
import { test as base, expect, request } from "@playwright/test";
import { Login } from "./actions/Login.js";
import { Movies } from "./actions/Movies.js";
import { popup } from "./actions/Components.js";
import { Leads } from "./actions/Leads.js";
import { API } from "./API/index.js";

/**
 * @typedef {Object} PageObjects
 * @property {Leads} leads
 * @property {Login} login
 * @property {Movies} movies
 * @property {popup} popup
 */

/**
 * @typedef {import('@playwright/test').APIRequestContext & { api: API }} RequestWithAPI
 */

/**
 * @type {import('@playwright/test').TestType<
 *   import('@playwright/test').PlaywrightTestArgs &
 *   import('@playwright/test').PlaywrightTestOptions &
 *   {
 *     page: import('@playwright/test').Page & PageObjects,
 *     request: RequestWithAPI
 *   },
 *   import('@playwright/test').PlaywrightWorkerArgs &
 *   import('@playwright/test').PlaywrightWorkerOptions
 * >}
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const pageWithActions = Object.assign(page, {
      leads: new Leads(page),
      login: new Login(page),
      movies: new Movies(page),
      popup: new popup(page),
    });

    await use(pageWithActions);
  },
  request: async ({ request }, use) => {
    const requestWithAPI = Object.assign(request, {
      api: new API(request),
    });

    await requestWithAPI['api'].setToken()

    await use(requestWithAPI);
  },
});

export { expect, request };
