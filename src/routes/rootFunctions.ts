import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export async function loader({ request }: LoaderFunctionArgs<unknown>) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q }
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
