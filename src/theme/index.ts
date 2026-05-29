/**
 * Theme system - centralized design tokens
 *
 * To customize your app's appearance, edit src/theme/default.ts
 */

export { defaultTheme as theme } from './default';
export type { Theme } from './types';
export type { SemanticTextRole } from './default';
export { applyTheme } from './applyTheme';
export { applyDeviceClass, detectDeviceClass } from './deviceClass';
export type { DeviceClass } from './deviceClass';
