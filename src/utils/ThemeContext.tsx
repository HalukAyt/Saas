import React, { createContext, useContext, useState, ReactNode } from "react";
import { Appearance } from "react-native";

const lightTheme = {
  colors: {
    background: "#ffffff",
    card: "#f8f8f8",
    text: "#000000",
    textSecondary: "#666",
    primary: "#4a90e2",
    border: "#ddd",
  },
};

const darkTheme = {
  colors: {
    background: "#121212",
    card: "#1E1E1E",
    text: "#ffffff",
    textSecondary: "#aaa",
    primary: "#4a90e2",
    border: "#333",
  },
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === "dark" ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
