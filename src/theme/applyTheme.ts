import RundotGameAPI from '@series-inc/rundot-game-sdk/api';
import type { Theme } from './types';
import type { DeviceClass } from './deviceClass';

const SEMANTIC_VARS_STYLE_ID = 'rundot-semantic-text-vars';

const kebab = (role: string): string => role.replace(/([A-Z])/g, '-$1').toLowerCase();

interface RoleValues {
  readonly size: string;
  readonly lineHeight: string;
  readonly weight: number;
}

// The Rundot host caps the iframe and disables browser pinch-zoom + OS font
// scale via `user-scalable=no` in index.html, so the SDK surfaces user-set
// font scaling as `device.fontScale` instead. Apply it at the emit point so
// every semantic role honors it uniformly.
const getFontScale = (): number => {
  try {
    const fs = RundotGameAPI.system.getDevice().fontScale;
    return typeof fs === 'number' && fs > 0 ? fs : 1;
  } catch {
    return 1;
  }
};

const scaleSize = (size: string, fontScale: number): string => {
  if (fontScale === 1) return size;
  const match = /^(-?\d+(?:\.\d+)?)(px|rem|em)$/.exec(size.trim());
  if (!match) return size;
  const value = parseFloat(match[1] ?? '0');
  const unit = match[2] ?? 'px';
  const scaled = Math.round(value * fontScale);
  return `${scaled}${unit}`;
};

const semanticVarsBlock = (
  roles: Readonly<Record<string, RoleValues>>,
  fontScale: number,
): string => {
  return Object.entries(roles)
    .map(([role, values]) => {
      const k = kebab(role);
      const size = scaleSize(values.size, fontScale);
      return `    --text-${k}: ${size};\n    --text-${k}-lh: ${values.lineHeight};\n    --text-${k}-weight: ${values.weight};`;
    })
    .join('\n');
};

const buildSemanticStylesheet = (text: Theme['text']): string => {
  const fontScale = getFontScale();
  const classes: DeviceClass[] = ['mobile', 'desktop', 'tv'];
  return classes
    .map((cls) => {
      const selector = cls === 'mobile' ? ':root' : `:root[data-device="${cls}"]`;
      return `${selector} {\n${semanticVarsBlock(text[cls], fontScale)}\n  }`;
    })
    .join('\n');
};

/**
 * Apply theme values to CSS variables
 * Call this once on app initialization
 */
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-text-primary', theme.colors.text.primary);
  root.style.setProperty('--color-text-muted', theme.colors.text.muted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);

  // Apply spacing variables
  root.style.setProperty('--spacing-xs', `${theme.spacing.xs}px`);
  root.style.setProperty('--spacing-sm', `${theme.spacing.sm}px`);
  root.style.setProperty('--spacing-md', `${theme.spacing.md}px`);
  root.style.setProperty('--spacing-lg', `${theme.spacing.lg}px`);
  root.style.setProperty('--spacing-xl', `${theme.spacing.xl}px`);

  // Apply border radius variables
  root.style.setProperty('--radius-sm', `${theme.borderRadius.sm}px`);
  root.style.setProperty('--radius-md', `${theme.borderRadius.md}px`);
  root.style.setProperty('--radius-lg', `${theme.borderRadius.lg}px`);
  root.style.setProperty('--radius-full', `${theme.borderRadius.full}px`);

  // Apply font size variables
  root.style.setProperty('--font-xs', `${theme.fontSize.xs}px`);
  root.style.setProperty('--font-sm', `${theme.fontSize.sm}px`);
  root.style.setProperty('--font-md', `${theme.fontSize.md}px`);
  root.style.setProperty('--font-lg', `${theme.fontSize.lg}px`);
  root.style.setProperty('--font-xl', `${theme.fontSize.xl}px`);
  root.style.setProperty('--font-xxl', `${theme.fontSize.xxl}px`);

  // Apply font weight variables
  root.style.setProperty('--font-normal', theme.fontWeight.normal.toString());
  root.style.setProperty('--font-medium', theme.fontWeight.medium.toString());
  root.style.setProperty('--font-semibold', theme.fontWeight.semibold.toString());
  root.style.setProperty('--font-bold', theme.fontWeight.bold.toString());

  // Apply animation duration variables (in ms for JavaScript, convert for CSS)
  root.style.setProperty('--animation-fast', `${theme.animation.fast}ms`);
  root.style.setProperty('--animation-normal', `${theme.animation.normal}ms`);
  root.style.setProperty('--animation-slow', `${theme.animation.slow}ms`);

  // Apply semantic text variables (mobile/desktop/tv) via an injected style tag
  // so the device-class overrides come from a single source of truth.
  const css = buildSemanticStylesheet(theme.text);
  let styleTag = document.getElementById(SEMANTIC_VARS_STYLE_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = SEMANTIC_VARS_STYLE_ID;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;
};
