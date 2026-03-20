import { Storefront } from "@/components/storefront";
import { getStorefrontData } from "@/lib/store-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getStorefrontData();

  return <Storefront data={data} />;
}
