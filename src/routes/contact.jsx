import { Button } from "@mui/material";
import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact;
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const contact = useLoaderData();

  const handleOnSubmit = (event) => {
    if (!confirm("Please confirm you want to delete this record.")) {
      event.preventDefault();
    }
  };

  const titleContacts =
    contact.first || contact.last ? (
      <>
        {contact.first} {contact.last}
      </>
    ) : (
      <i>No Name</i>
    );

  const phoneContacts = contact.phone && (
    <p>
      <a target="_blank" href={`${contact.phone}`}>
        {contact.phone}
      </a>
    </p>
  );

  const twitterContacts = contact.twitter && (
    <p>
      <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
        {contact.twitter}
      </a>
    </p>
  );

  const emailContacts = contact.email && (
    <p>
      <a target="_blank" href={`${contact.email}`}>
        {contact.email}
      </a>
    </p>
  );

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || null} />
      </div>

      <div>
        <h1>
          {titleContacts} <Favorite contact={contact} />
        </h1>
        <h4 className="secondText">{phoneContacts}</h4>
        <h4 className="secondText">{twitterContacts}</h4>
        <h4 className="secondText"> {emailContacts}</h4>
        <h4 className="secondText">
          {contact.notes && <p>{contact.notes}</p>}
        </h4>
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form method="post" action="destroy" onSubmit={handleOnSubmit}>
            <button id="remove_button" type="submit">
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  const valueButton = favorite ? "false" : "true";
  const ariaLabelButton = favorite
    ? "Remove from favorites"
    : "Add to favorites";
  const favoriteValue = favorite ? "★" : "☆";

  return (
    <fetcher.Form method="post">
      <button
        className="icon"
        name="favorite"
        value={valueButton}
        aria-label={ariaLabelButton}
      >
        {favoriteValue}
      </button>
    </fetcher.Form>
  );
}
