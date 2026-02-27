import { ApiKeysConsole } from "@/components/console/ApiKeysConsole";
import { listApiKeys, DEMO_ORG_ID } from "@/lib/console/store";

export default function ConsoleApiKeysPage() {
  const keys = listApiKeys(DEMO_ORG_ID);
  return <ApiKeysConsole initialKeys={keys} />;
}
