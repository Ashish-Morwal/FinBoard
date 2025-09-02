import { z } from "zod";

// Widget types
export const WidgetType = z.enum(['card', 'table', 'chart', 'watchlist']);

// Widget size
export const WidgetSize = z.enum(['small', 'medium', 'large', 'full']);

// Display field schema
export const DisplayFieldSchema = z.object({
  path: z.string(),
  label: z.string(),
  type: z.string(),
});

// Widget configuration schema
export const WidgetConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: WidgetType,
  size: WidgetSize.default('medium'),
  apiUrl: z.string().url(),
  refreshInterval: z.number().min(30).default(30),
  selectedFields: z.array(DisplayFieldSchema),
  position: z.number().default(0),
  lastUpdated: z.string().optional(),
  data: z.any().optional(),
});

// Dashboard configuration schema
export const DashboardConfigSchema = z.object({
  widgets: z.array(WidgetConfigSchema),
  theme: z.enum(['light', 'dark']).default('dark'),
  apiKeys: z.object({
    alphaVantage: z.string().optional(),
    finnhub: z.string().optional(),
  }).default({}),
});

// API response field schema
export const ApiFieldSchema = z.object({
  path: z.string(),
  type: z.string(),
  value: z.any(),
  isArray: z.boolean().default(false),
});

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;
export type DisplayField = z.infer<typeof DisplayFieldSchema>;
export type ApiField = z.infer<typeof ApiFieldSchema>;
export type WidgetTypeEnum = z.infer<typeof WidgetType>;
export type WidgetSizeEnum = z.infer<typeof WidgetSize>;
