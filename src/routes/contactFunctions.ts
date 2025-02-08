import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }: LoaderFunctionArgs<unknown>) {
  const contact = !params.contactId ? null : await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

export async function action({ request, params }: ActionFunctionArgs<unknown>) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}
