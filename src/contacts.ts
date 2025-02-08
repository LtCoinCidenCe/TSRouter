/* eslint-disable prefer-const */
import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import { ContactObject } from "./types";

export async function getContacts(query: string | undefined) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem<ContactObject[]>("contacts") as ContactObject[];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork(null);
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts(undefined);
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string): Promise<ContactObject | null> {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem<ContactObject[]>("contacts") as ContactObject[];
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id: string, updates: ContactObject) {
  await fakeNetwork(null);
  let contacts = await localforage.getItem<ContactObject[]>("contacts") as ContactObject[];
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  let contacts = await localforage.getItem<ContactObject[]>("contacts") as ContactObject[];
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: ContactObject[]) {
  return localforage.setItem("contacts", contacts);
}

set([])

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = new Map<string, boolean>();

async function fakeNetwork(key: string | null) {
  if (!key) {
    fakeCache = new Map<string, boolean>();
  }
  else if (fakeCache.get(key)) {
    return;
  }
  else {
    fakeCache.set(key, true);
  }

  // console.log("fakeCache");
  // console.log(fakeCache);
  return new Promise(res => {
    setTimeout(res, Math.random() * 1600);
  });
}
