import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const semanticTokens = {
  colors: {
    "bg.canvas": {
      default: "gray.50",
      _dark: "gray.900",
    },
    "fg.default": {
      default: "gray.900",
      _dark: "gray.100",
    },
    "border.subtle": {
      default: "gray.200",
      _dark: "gray.600",
    },
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
  Table: {
    variants: {
      simple: {
        th: {
          borderColor: "border.subtle",
          color: "fg.default",
        },
        td: {
          borderColor: "border.subtle",
        },
      },
    },
  },
  Thead: {
    baseStyle: {
      th: {
        bg: { default: "gray.100", _dark: "gray.800" },
        color: "fg.default",
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: "bg.canvas",
      color: "fg.default",
    },
    "#root": {
      minHeight: "100vh",
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  fonts,
  breakpoints,
  components,
  styles,
});

export default theme;
