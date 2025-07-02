// app/index.js  (antes app/page.js)
'use client';
import Home from './home.js';
export default function CatalogosPage() {
  return <Home isManuais={false} />;
}
