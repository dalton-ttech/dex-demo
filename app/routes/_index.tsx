import { type MetaFunction } from "@remix-run/node";
import FirstPage from "@/components/landing/FirstPage";

export const meta: MetaFunction = () => {
  return [
    { title: import.meta.env.VITE_APP_NAME },
    { name: "description", content: import.meta.env.VITE_APP_DESCRIPTION },
  ];
};

export default function Index() {
  return <FirstPage />;
}
