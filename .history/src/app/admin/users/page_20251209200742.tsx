'use client';
import { useState, useEffect, useMemo } from 'react';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  banned?: boolean;
  createdAt: number;
  lastSignInAt: number | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Conffeti cuando se banea a un usuario
  const triggerConfetti = () => {
    // Crear múltiples piezas de confeti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)];
      document.body.appendChild(confetti);
      
      // Eliminar después de la animación
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  // 🔍 BÚSQUEDA - Filtrar usuarios basado en el query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.email?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/users');
      
      if (!res.ok) {
        throw new Error('No autorizado o error al cargar usuarios');
      }
      
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    
    // Inyectar estilos CSS para el confeti
    const style = document.createElement('style');
    style.textContent = `
      .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: fall 3s linear forwards;
      }
      
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => style.remove();
  }, []);

  // Ejecutar acción (ban/unban)
  async function doAction(id: string, action: 'ban' | 'unban') {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al ejecutar la acción');
      }

      // 🎊 CONFETI cuando se banea! (porque banear gente es... ¿celebrable? 😅)
      if (action === 'ban') {
        triggerConfetti();
      }

      // Recargar lista de usuarios
      await loadUsers();
      
      // Feedback visual
      const messages = {
        ban: 'baneado',
        unban: 'desbaneado'
      };
      alert(`✅ Usuario ${messages[action]} con éxito`);
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      console.error('Error executing action:', err);
    } finally {
      setActionLoading(null);
    }
  }

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-bold-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className=''>Administración del blog</h1>
      <div className="bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-900 to-blue-950 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                👥 Gestión de Usuarios
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Total: {users.length} usuario{users.length !== 1 ? 's' : ''}
                {searchQuery && ` • Mostrando: ${filteredUsers.length}`}
              </p>
            </div>

            {/* 🔍 BARRA DE BÚSQUEDA */}
            <div className="px-6 py-4 bg-gray-800 border-bold border-gray-900">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar por email, nombre o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-white rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent outline-none transition-all"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800 border-bold border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-white">
                        {searchQuery ? (
                          <div>
                            <p className="text-lg mb-2">🔍</p>
                            <p>No se encontraron usuarios con "{searchQuery}"</p>
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Limpiar búsqueda
                            </button>
                          </div>
                        ) : (
                          'No hay usuarios para mostrar'
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {user.email || '(sin email)'}
                          </div>
                          <div className="text-xs text-white mt-0.5">
                            ID: {user.id.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.name || '(sin nombre)'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.banned ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              🚫 Baneado
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              ✓ Activo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                          <div className="flex gap-2 justify-end">
                            {user.banned ? (
                              <button
                                onClick={() => doAction(user.id, 'unban')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                              >
                                {actionLoading === user.id ? '...' : '🔓 Desbanear'}
                              </button>
                            ) : (
                              <button
                                onClick={() => doAction(user.id, 'ban')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold"
                              >
                                {actionLoading === user.id ? '...' : '🚫 Banear'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}