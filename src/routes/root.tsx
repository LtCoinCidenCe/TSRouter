import { Link, Outlet, useLoaderData, Form, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { useEffect } from "react";
import { ContactObject } from "../types";

export default function Root() {
  const { contacts, q } = useLoaderData<{ contacts: ContactObject[], q: string | null }>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    if (!q) {
      return;
    }
    else
      (document.getElementById("q") as HTMLInputElement).value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1><Link style={{ color: "inherit", textDecoration: "none" }} to="/">React Router Contacts</Link></h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={!q ? "" : q}
              onChange={(event) => {
                const isFirstSearch = q === null;
                console.log(isFirstSearch);
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                          ? "pending"
                          : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={
        navigation.state === "loading" ? "loading" : ""
      }>
        <Outlet />
      </div>
    </>
  );
}
