# @openchatai/copilot-flows-editor

## 1.5.0

### Minor Changes

- 2a9674e: - Now we can limit the flows created by setting `maxFlows` prop.
  - auto externalize the peer deps in lib mode (ci-change).
  - Now we can delete flows (ui-change).
  - edited `./package.json` deps and peer deps.
  - we no longer load reset styles in lib mode (assuming that we use tailwindcss in the dashboard).

## 1.4.0

### Minor Changes

- 5c82878: no need for tailwind reset in lib mode, some code formatting.

## 1.3.6

### Patch Changes

- 66397d0: export `transformPaths`.

## 1.3.5

### Patch Changes

- 9bc30eb: set draggable to false to nodes, to avoid shifting when dragged.

## 1.3.4

### Patch Changes

- e806091: making some of path keys optional

## 1.3.3

### Patch Changes

- 2beec39: export some useful utils

## 1.3.2

### Patch Changes

- 424a35d: trial 1

## 1.3.1

### Patch Changes

- c6987da: fixed u is undefinded

## 1.3.0

### Minor Changes

- ac72030: we can pass initialState to the controller.

## 1.2.0

### Minor Changes

- aed06ee: standalone and non standalone mode, for more control over the editor

## 1.1.3

### Patch Changes

- f21312b: styling issues with the Api Nodes styles.

## 1.1.2

### Patch Changes

- be13f38: fixes

## 1.1.1

### Patch Changes

- 775b294: some style customizations

## 1.1.0

### Minor Changes

- 1aa80aa: updated styles.

## 1.0.0

### Major Changes

- 97d72bd: the first stable version, included with tests, and bug fixes.

## 0.0.6

### Patch Changes

- c8aa0c2: fixed:styles issue

## 0.0.5

### Patch Changes

- edeaf86: reactflow provider issues

## 0.0.4

### Patch Changes

- 7011621: same issue

## 0.0.3

### Patch Changes

- dc5f18c: updatd exported types from package.json

## 0.0.2

### Patch Changes

- 7e2b904: changed typo in `./package.json`

## 0.0.1

### Patch Changes

- 1e5c65b: added styles.css

## 0.0.0

### Minor Changes

- 2973638: the first minor releas, to test the ci
