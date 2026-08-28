// Per-page metadata helper — SEO fields (used by every page).
import { SITE } from '@/lib/site';

export function pageMeta({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: { title: `${title} — ${SITE.name}`, description, url: `${SITE.url}${path}`, type: 'website' },
  };
}
