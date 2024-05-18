import { readFile, writeFile } from "fs/promises";
import path from "node:path";
import { randomUUID } from "crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await readFile(contactsPath, { encoding: "utf8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContacts(id) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === id);

  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function addContact(contact) {
  const contacts = await listContacts();
  const newContact = { id: randomUUID(), ...contact };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

async function removeContact(id) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];
  contacts.splice(index, 1);

  await writeContacts(contacts);

  return removedContact;
}

async function updateContact(id, contact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const updatedContact = { ...contacts[index], ...contact };
  contacts[index] = updatedContact;
  await writeContacts(contacts);
  return updatedContact;
}

export default {
  listContacts,
  removeContact,
  addContact,
  getContacts,
  updateContact,
};
