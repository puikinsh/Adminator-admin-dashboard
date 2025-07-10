/**
 * Core type definitions for Adminator Dashboard
 */

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  theme: Theme;
  autoDetect: boolean;
  persistChoice: boolean;
}

// Component types
export interface ComponentOptions {
  [key: string]: any;
}

export interface ComponentInterface {
  name: string;
  element: HTMLElement;
  options: ComponentOptions;
  isInitialized: boolean;
  init(): void;
  destroy(): void;
}

// Sidebar types
export interface SidebarOptions {
  breakpoint?: number;
  collapsible?: boolean;
  autoHide?: boolean;
  animation?: boolean;
  animationDuration?: number;
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  activeMenu: string | null;
}

// Chart types
export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'scatter' | 'bubble' | 'polarArea';

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  type: ChartType;
  data: ChartData;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: any;
  scales?: any;
}

// DataTable types
export interface DataTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: any) => string;
}

export interface DataTableOptions {
  columns: DataTableColumn[];
  data: any[];
  pageSize?: number;
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
}

export interface DataTableState {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  filteredData: any[];
}

// Date utilities types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateFormatOptions {
  locale?: string;
  format?: string;
  timeZone?: string;
}

// DOM utilities types
export type DOMEventHandler = (event: Event) => void;

export interface DOMUtilities {
  select: (selector: string, context?: Element | Document) => HTMLElement | null;
  selectAll: (selector: string, context?: Element | Document) => HTMLElement[];
  on: (element: Element | Window | Document, event: string, handler: DOMEventHandler) => void;
  off: (element: Element | Window | Document, event: string, handler: DOMEventHandler) => void;
  addClass: (element: Element, className: string) => void;
  removeClass: (element: Element, className: string) => void;
  toggleClass: (element: Element, className: string) => void;
  hasClass: (element: Element, className: string) => boolean;
  attr: (element: Element, attribute: string, value?: string) => string | void;
  data: (element: Element, key: string, value?: any) => any;
  ready: (callback: () => void) => void;
  exists: (selector: string, context?: Element | Document) => boolean;
}

// Application state types
export interface ApplicationState {
  theme: Theme;
  sidebar: SidebarState;
  components: Map<string, ComponentInterface>;
  isInitialized: boolean;
}

export interface ApplicationConfig {
  theme: ThemeConfig;
  sidebar: SidebarOptions;
  enableAnalytics?: boolean;
  debugMode?: boolean;
}

// Event types
export interface CustomEventDetail {
  [key: string]: any;
}

export interface ThemeChangeEvent extends CustomEvent {
  detail: {
    theme: Theme;
    previousTheme: Theme;
  };
}

export interface ComponentEvent extends CustomEvent {
  detail: {
    component: string;
    action: 'init' | 'destroy' | 'update';
    data?: any;
  };
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Color types
export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
}

export interface ThemeColors {
  light: ColorPalette;
  dark: ColorPalette;
}

// Animation types
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

export interface AnimationOptions {
  duration?: number;
  easing?: AnimationEasing;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Layout types
export interface LayoutBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ResponsiveConfig {
  breakpoints: LayoutBreakpoints;
  mobileFirst: boolean;
}

// Error types
export class AdminatorError extends Error {
  constructor(
    message: string,
    public component?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AdminatorError';
  }
}

// Plugin types
export interface PluginInterface {
  name: string;
  version: string;
  dependencies?: string[];
  init(app: any): void;
  destroy(): void;
}

export interface PluginRegistry {
  [key: string]: PluginInterface;
}