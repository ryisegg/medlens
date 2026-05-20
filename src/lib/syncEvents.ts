export const SYNC_APPLIED_EVENT = "medlens-sync-applied";

export function notifySyncApplied() {
  window.dispatchEvent(new Event(SYNC_APPLIED_EVENT));
}
