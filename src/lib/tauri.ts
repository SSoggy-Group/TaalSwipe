/**
 * True when running inside the Tauri desktop shell (WKWebView / WebView2).
 * The desktop webview does not need PWA offline caching, and registering a
 * service worker there can serve stale bundles that leave the app stuck on
 * the loading splash across app updates.
 */
export const isTauri = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
