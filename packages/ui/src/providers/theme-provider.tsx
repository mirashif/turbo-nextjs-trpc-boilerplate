"use client";

import { ThemeProvider } from "@repo/ui/hooks/use-theme";
interface ValueObject {
  [themeName: string]: string;
}
export interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string;
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: string | "class";
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string;
  children?: React.ReactNode;
}
import type { PropsWithChildren } from "react";
import React from "react";
export const NextThemeProvider: React.FC<
  PropsWithChildren & ThemeProviderProps
> = ({ children, ...props }) => {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
