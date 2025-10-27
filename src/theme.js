import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const fonts = {
  heading: `monospace`,
  body: `monospace`,
};

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};

const components = {
  Input: {
    defaultProps: {
      size: "xs",
    },
  },
  Select: {
    defaultProps: {
      size: "xs",
    },
  },
  Button: {
    variants: {
      save: { backgroundColor: "#E53E3E", color: "white" },
    },
  },
};

const theme = extendTheme({ colors, fonts, breakpoints, components });

export default theme;
