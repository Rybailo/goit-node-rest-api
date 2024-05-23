import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res) => {
  try {
    const allContacts = await Contact.find();
    console.log(allContacts);
    res.status(200).json(allContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const { error, value } = createContactSchema.validate(
      {
        name,
        email,
        phone,
      },
      { abortEarly: false }
    );

    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.message });
    }
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error, value } = updateContactSchema.validate(
      {
        name,
        email,
        phone,
      },
      { abortEarly: false }
    );

    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.message });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const updatedStatus = await Contact.findByIdAndUpdate(id, req.body);
  if (!updatedStatus) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedStatus);
};
