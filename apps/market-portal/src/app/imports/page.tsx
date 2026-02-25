// Imports list page - placeholder
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/middleware/auth';

export default function ImportsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!requireAuth()) {
      return;
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Imports</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Lista de imports realizados.
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
          TODO: Implementar listagem de imports
        </p>
      </div>
    </div>
  );
}

