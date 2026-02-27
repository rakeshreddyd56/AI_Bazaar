import { PlaygroundConsole } from "@/components/console/PlaygroundConsole";
import { consoleModels } from "@/lib/console/models";

export default function ConsolePlaygroundPage() {
  const models = consoleModels()
    .slice(0, 80)
    .map((model) => ({
      modelId: model.modelId,
      name: model.name,
      family: model.family,
      parameterSupport: model.parameterSupport,
      supports: model.supports,
      runtimeState: model.runtimeState,
      provider: model.provider,
    }));

  return <PlaygroundConsole models={models} />;
}
