# copilot-flows-editor ( the library )

## Installation

```bash
pnpm add @openchatai/copilot-flows-editor
```

## Usage

````tsx
import { Controller, FlowArena,CodePreview } from "@openchatai/copilot-flows-editor"; // import the components
import "@openchatai/copilot-flows-editor/dist/style.css"; // import the styles

function FlowsEditorDemo() {
  return (
    <Controller> // wrap the components in the controller
      <div className="w-full h-screen relative flex items-start flex-col font-openSans overflow-hidden">
        <div className="flex items-start justify-between relative w-full flex-1 overflow-hidden">
          <FlowArena /> // add the flow arena (the aside menu and the canvas)
          <CodePreview/> // preview the flow code (based on our flow schema)
        </div>
      </div>
    </Controller>
  );
}

    ```
````
