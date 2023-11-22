import  { createContext, useState, useMemo } from "react"
import { createTheme } from "@mui/material/styles"

export const tokens = (mode) => ({
    ...(mode === "dark"
    ? {
        maroon: {
          100: "#e8d5d9",
          200: "#d1abb3",
          300: "#ba828c",
          400: "#a35866",
          500: "#8c2e40",
          600: "#702533",
          700: "#541c26",
          800: "#38121a",
          900: "#1c090d"
        },
        pink: {
          100: "#e8d5da",
          200: "#d1abb5",
          300: "#ba8291",
          400: "#a3586c",
          500: "#8c2e47",
          600: "#702539",
          700: "#541c2b",
          800: "#38121c",
          900: "#1c090e"
},
        yellow: {
          100: "#f7f1e4",
          200: "#f0e2c9",
          300: "#e8d4af",
          400: "#e1c594",
          500: "#d9b779",
          600: "#ae9261",
          700: "#826e49",
          800: "#574930",
          900: "#2b2518"
},
        goldish: {
          100: "#ede4d9",
          200: "#dbc9b2",
          300: "#caae8c",
          400: "#b89365",
          500: "#a6783f",
          600: "#856032",
          700: "#644826",
          800: "#423019",
          900: "#21180d"
},
        white: {
          100: "#fcfcfc",
          200: "#fafafa",
          300: "#f7f7f7",
          400: "#f5f5f5",
          500: "#f2f2f2",
          600: "#c2c2c2",
          700: "#919191",
          800: "#616161",
          900: "#303030"
},
    } 
    : {
        maroon: {
            100: "#1c090d",
            200: "#38121a",
            300: "#541c26",
            400: "#702533",
            500: "#8c2e40",
            600: "#a35866",
            700: "#ba828c",
            800: "#d1abb3",
            900: "#e8d5d9",
  },
          pink: {
            100: "#1c090e",
            200: "#38121c",
            300: "#541c2b",
            400: "#702539",
            500: "#8c2e47",
            600: "#a3586c",
            700: "#ba8291",
            800: "#d1abb5",
            900: "#e8d5da",
  },
          yellow: {
            100: "#2b2518",
            200: "#574930",
            300: "#826e49",
            400: "#ae9261",
            500: "#d9b779",
            600: "#e1c594",
            700: "#e8d4af",
            800: "#f0e2c9",
            900: "#f7f1e4",
  },
          goldish: {
            100: "#21180d",
            200: "#423019",
            300: "#644826",
            400: "#856032",
            500: "#a6783f",
            600: "#b89365",
            700: "#caae8c",
            800: "#dbc9b2",
            900: "#ede4d9",
  },
          white: {
            100: "#303030",
            200: "#616161",
            300: "#919191",
            400: "#c2c2c2",
            500: "#f2f2f2",
            600: "#f5f5f5",
            700: "#f7f7f7",
            800: "#fafafa",
            900: "#fcfcfc",
  },

    })
})

//MUI Theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);
  
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              primary: {
                main: colors.pink[500],
              },
              secondary: {
                main: colors.yellow[300],
              },
              neutral: {
                dark: colors.maroon[700],
                main: colors.maroon[500],
                light: colors.maroon[100],
              },
              background: {
                default: colors.maroon[500],
              },
              reddish: {
                main: colors.goldish[500],
              },
            }
          : {
              primary: {
                main: colors.pink[100],
              },
              secondary: {
                main: colors.yellow[500],
              },
              neutral: {
                dark: colors.maroon[700],
                main: colors.maroon[500],
                light: colors.maroon[100],
              },
              background: {
                default: "#fcfcfc",
              },
            }),
      },
      typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };
  
  // context for color mode
  export const ColorModeContext = createContext({
    toggleColorMode: () => {},
  });
  
  export const useMode = () => {
    const [mode, setMode] = useState("dark");
  
    const colorMode = useMemo(
      () => ({
        toggleColorMode: () =>
          setMode((prev) => (prev === "light" ? "dark" : "light")),
      }),
      []
    );
  
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
    return [theme, colorMode];
  };