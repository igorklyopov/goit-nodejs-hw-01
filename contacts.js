const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readContacts() {
  try {
    const contactsData = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(contactsData);
  } catch (error) {
    return console.error(chalk.red(error.message));
  }
}

async function listContacts() {
  try {
    const contacts = await readContacts(contactsPath);

    console.table(contacts);
  } catch (error) {
    return console.error(chalk.red(error.message));
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();

    const contact = contacts.find(
      ({ id }) => id.toString() === contactId.toString()
    );

    if (contact) {
      console.table(contact);

      return contact;
    } else {
      console.log(chalk.yellow("Contact not found!"));

      return;
    }
  } catch (error) {
    return console.error(chalk.red(error.message));
  }
}

async function removeContact(contactId) {
  try {
    const prevContacts = await readContacts();
    const contact = prevContacts.find(
      ({ id }) => id.toString() === contactId.toString()
    );

    if (!contact)
      return console.log(
        chalk.yellow(`Contact with id: "${contactId}" not found!`)
      );

    const newContacts = prevContacts.filter(
      ({ id }) => id.toString() !== contactId.toString()
    );

    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

    console.log(chalk.greenBright("Contact is removed from the contact list!"));

    return newContacts;
  } catch (error) {
    return console.error(chalk.red(error.message));
  }
}

async function addContact(name, email, phone) {
  try {
    const prevContacts = await readContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    const updatedContacts = [...prevContacts, newContact];

    const duplicateContact = prevContacts.find(
      (prevContact) =>
        name.toLowerCase() === prevContact.name.toLowerCase() &&
        email.toLowerCase() === prevContact.email.toLowerCase() &&
        phone === prevContact.phone
    );

    if (duplicateContact)
      return console.log(chalk.yellow("This entry is already in contacts!"));

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

    console.log(chalk.greenBright(`${name} is added to the contact list!`));

    return newContact;
  } catch (error) {
    return console.error(chalk.red(error.message));
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
