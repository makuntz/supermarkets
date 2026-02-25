// Import detail page - placeholder
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { requireAuth } from '@/middleware/auth';

export default function ImportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const importId = params.id as string;

  useEffect(() => {
    if (!requireAuth()) {
      return;
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Import Detail</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Detalhes do import: {importId}
      </p>
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <p style={{ color: '#999', fontSize: '0.875rem' }}>
          TODO: Implementar detalhes do import
        </p>
      </div>
    </div>
  );
}

