'use client';

import dynamic from 'next/dynamic';

const Inspector = dynamic(
  () => import('react-dev-inspector').then((mod) => mod.Inspector),
  { ssr: false }
);

export default function DevInspector() {
  return <Inspector />;
}
