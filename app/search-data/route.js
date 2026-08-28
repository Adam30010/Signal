import { SEARCH_INDEX } from '@/lib/search';

// Static JSON index — lets any client (or external search crawler) fetch
// the full site index. Generated from the same source as the modal search.
export function GET() {
  return Response.json(
    { site: 'SIGNAL', generated: new Date().toISOString(), count: SEARCH_INDEX.length, entries: SEARCH_INDEX },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
}
