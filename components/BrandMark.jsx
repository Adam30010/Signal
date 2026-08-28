'use client';

import { useEffect, useState } from 'react';
import { BRANDING_EVENT, getBranding } from '@/lib/branding';
import { SITE } from '@/lib/site';

// Brand mark: shows the admin-uploaded logo when set, otherwise the
// default terminal glyph (▮). Re-renders live when branding changes.
export default function BrandMark({ height = 18, style = {} }) {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const update = () => setLogo(getBranding()?.logo || null);
    update();
    window.addEventListener(BRANDING_EVENT, update);
    return () => window.removeEventListener(BRANDING_EVENT, update);
  }, []);

  if (logo) {
    return (
      <img
        src={logo}
        alt={`${SITE.name} logo`}
        style={{ height, width: 'auto', display: 'block', alignSelf: 'center', ...style }}
      />
    );
  }
  return <span className="tick" style={style}>▮</span>;
}
