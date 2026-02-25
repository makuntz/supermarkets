// Dashboard page - placeholder
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/middleware/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!requireAuth()) {
      return;
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Visão geral dos imports e estatísticas do mercado.
      </p>
      <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.875rem' }}>
        TODO: Implementar dashboard real
      </p>
    </div>
  );
}

