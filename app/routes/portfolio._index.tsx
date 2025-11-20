import { MetaFunction } from "@remix-run/node";
import { OverviewModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle("Portfolio") }];
};

export default function PortfolioPage() {
  return <OverviewModule.OverviewPage />;
}
