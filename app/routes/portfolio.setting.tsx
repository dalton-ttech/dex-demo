import { MetaFunction } from "@remix-run/node";
import { SettingModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Settings") }];
};

export default function SettingsPage() {
  return <SettingModule.SettingPage />;
}
