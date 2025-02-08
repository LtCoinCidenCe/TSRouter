import { useRouteError } from "react-router-dom";

type ErrorObject = {
    data: string
    status: number
    message?: string
    statusText: string
}

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  const errorTS = error as ErrorObject

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorTS.statusText || errorTS.message}</i>
      </p>
    </div>
  );
}
