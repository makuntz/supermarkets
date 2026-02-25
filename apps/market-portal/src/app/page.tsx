// Home page - redireciona para login ou dashboard
import { redirect } from 'next/navigation';

export default function HomePage() {
  // TODO: Verificar autenticação e redirecionar
  redirect('/login');
}

