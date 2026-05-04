/**
 * Zennith open-design exports — entry point.
 * Each exporter takes a generated artifact and pushes it to a downstream
 * channel (Shopify / Klaviyo / Meta). All exporters are idempotent at the
 * artifact level via the artifact-bus event ledger.
 */
export { exportToShopify, default as shopifyExport } from './shopify';
export type { ShopifyExportInput, ShopifyExportResult, ShopifyKind } from './shopify';

export { exportToKlaviyo, default as klaviyoExport } from './klaviyo';
export type { KlaviyoExportInput, KlaviyoExportResult, KlaviyoKind } from './klaviyo';

export { exportToMeta, default as metaExport } from './meta';
export type { MetaExportInput, MetaExportResult, MetaKind } from './meta';
