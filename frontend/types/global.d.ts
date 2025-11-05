// Type declarations for non-code imports used by the app (CSS, images, etc.).
// This lets TypeScript accept side-effect imports like `import './globals.css'`.
declare module "*.css" {
  const content: unknown;
  export default content;
}

declare module "*.module.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: unknown;
  export default content;
}

declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.jpeg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  import * as React from "react";
  const src: string;
  export default src;
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
}

export {};
