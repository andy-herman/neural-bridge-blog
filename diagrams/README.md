# Diagrams

Mermaid sources for the data-flow figures on project pages. Each `.mmd` renders twice, light and dark, to `public/images/projects/<name>-<light|dark>.svg`; pages show the right one through `<picture>` and `prefers-color-scheme` (the site's `darkMode` is `media`).

## Palette placeholders

Sources use placeholders so accent classes follow the site palette in both themes. Replace them before rendering:

| Placeholder | Light | Dark |
|---|---|---|
| `{{ACCENT}}` | `#c2410c` (rust-500) | `#ea6630` (rust-400) |
| `{{ACCENT_FILL}}` | `#fbeee6` | `#2a1a12` |
| `{{MUTED}}` | `#8a7f6c` | `#a89c86` |
| `{{MUTED_FILL}}` | `#ebe5d4` (cream-200) | `#241e18` |

Node roles: `gate` (hexagon, accent border) for checks and decisions, `stop` (dashed, muted) for held-back or refused paths, `out` (accent border) for the result.

## Rendering

Use the theme configs here with Mermaid 11 or later: `theme-light.json`, `theme-dark.json`. Both set `htmlLabels: false`. HTML labels emit `<br>` inside `<foreignObject>`, which is not valid XML, and a browser refuses to draw such an SVG inside an `<img>`.

```
npx -p @mermaid-js/mermaid-cli mmdc -i <filled>.mmd -o public/images/projects/<name>-light.svg -c diagrams/theme-light.json -b transparent
```

Then strip any `@font-face` blocks from the SVG. The CLI embeds a web font, which an SVG inside `<img>` cannot use anyway, and it triples the file size.

## Layout notes

- Mermaid ignores a subgraph's own `direction` once any node inside it links outside. To keep lanes horizontal, link the subgraphs themselves (`BUILD ==> QUERY`), not nodes across them.
- Diamonds grow with their label. Use hexagons (`{{"..."}}`) for gates.
- Keep figures under about 1,200 px wide. Wider figures get unreadable at the prose width, even with the page's breakout.
