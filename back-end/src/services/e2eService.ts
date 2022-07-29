import { e2eRepository } from "../repositories/e2eRepository.js";

async function reset() {
  await e2eRepository.reset();
}

async function insertData() {
  await e2eRepository.insertDatabaseForTests();
}

export const e2eService = {
  reset,
  insertData,
};
