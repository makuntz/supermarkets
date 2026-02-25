// Login page - placeholder
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implementar login real
    // const response = await authApi.login({ email, password });
    // localStorage.setItem('auth_token', response.accessToken);
    // router.push('/dashboard');

    setTimeout(() => {
      setLoading(false);
      alert('Login não implementado ainda');
    }, 500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login - Market Portal</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
        TODO: Implementar integração com backend
      </p>
    </div>
  );
}

