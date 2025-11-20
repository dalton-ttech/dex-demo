import {
  LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { DEFAULT_SYMBOL } from "@/utils/storage";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: import.meta.env.VITE_APP_DESCRIPTION },
  ];
};

export const loader: LoaderFunction = ({ request }) => {
  // Extract search parameters from the request URL
  const url = new URL(request.url);
  const searchParamsString = url.search;
  
  // Construct the redirect URL with search parameters
  const queryString = searchParamsString || "";
  
  return redirect(`/perp/${DEFAULT_SYMBOL}${queryString}`);
};

