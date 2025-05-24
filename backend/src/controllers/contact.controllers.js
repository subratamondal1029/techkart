import Contact from "../models/contact.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import sendMail from "../utils/sendMail.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim())
    throw new ApiError(400, "All fields are required");

  const contact = await Contact.create({ name, email, message });

  const companyMailText = `
    <p>You received a new message from your website:</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
    <p><strong>Message:</strong><br />
    ${message}</p>
    <p>Submitted on: ${new Date().toLocaleString()}</p>
  `;

  const userMailText = `
    <p>Hi ${name},</p>
    <p>Thanks for reaching out to us!</p>
    <p>We received your message and will get back to you as soon as possible.</p>
    <p>Here’s a copy of what you sent:</p>
    <hr />
    <p>${message}</p>
    <hr />
    <p>Best regards,<br />
    Techkart<br />
    <a href="${process.env.FRONTEND_BASE_URL}" target="_blank">${process.env.FRONTEND_BASE_URL}</a>
    </p>
  `;

  sendMail({
    receivers: process.env.CONTACT_EMAIL,
    subject: "New message from your contact form",
    body: companyMailText,
  });

  sendMail({
    receivers: email,
    subject: "Thanks for reaching out to us",
    body: userMailText,
  });

  res.json(
    new ApiResponse(200, "Contact created successfully", { id: contact._id })
  );
});

const getContacts = asyncHandler(async (req, res) => {
  if (req.user.label !== "admin" || req.user.label !== "support")
    throw new ApiError(403, "Unauthorized");

  const contacts = await Contact.find({ resolved: false });
  res.json(new ApiResponse(200, "Contacts fetched successfully", contacts));
});

const resolveContact = asyncHandler(async (req, res) => {
  if (req.user.label !== "admin" || req.user.label !== "support")
    throw new ApiError(403, "Unauthorized");

  const contact = await Contact.findById(req.params.id);

  if (!contact) throw new ApiError(404, "Contact not found");

  contact.resolved = true;
  await contact.save();

  res.json(new ApiResponse(200, "Contact resolved successfully", contact));
});

export { createContact, getContacts, resolveContact };
