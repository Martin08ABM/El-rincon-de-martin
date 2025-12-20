'use client';
import { useState, useMemo, useEffect } from 'react';

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

  // 🚀 CARGA INICIAL - ¡Esto faltaba!
  useEffect(() => {
    loadUsers();
  }, []);

  // BÚSQUEDA - Filtrar usuarios basado en el input
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

  // Ejecutar acción (ban/unban) - Optimizado
  async function doAction(id: string, action: 'ban' | 'unban') {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al ejecutar la acción');
      }

      // 🎯 Actualización optimista en lugar de recargar todo
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === id ? { ...u, banned: action === 'ban' } : u
        )
      );
      
      const messages = {
        ban: 'baneado',
        unban: 'desbaneado'
      };
      alert(`✅ Usuario ${messages[action]} con éxito`);
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      console.error('Error executing action:', err);
      // En caso de error, recargar para sincronizar
      await loadUsers();
    } finally {
      setActionLoading(null);
    }
  }

  // Estados de carga y error - Simplificados
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-4">
        <div className="bg-red-950 border border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-400 font-semibold mb-2">❌ Error</h3>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <h1 className="text-3xl font-black pt-8 text-center mb-6 uppercase text-white">
        Administración del blog - Sección de administración de los usuarios
      </h1>
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-900 rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-950 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                👥 Gestión de Usuarios
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                Total: {users.length} usuario{users.length !== 1 ? 's' : ''}
                {searchQuery && ` • Mostrando: ${filteredUsers.length}`}
              </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="px-6 py-4 bg-neutral-800 border-b border-neutral-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar por email, nombre o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-neutral-700 text-white border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        {searchQuery ? (
                          <div>
                            <p className="text-lg mb-2">🔍</p>
                            <p>No se encontraron usuarios con "{searchQuery}"</p>
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
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
                        className="hover:bg-neutral-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {user.email || '(sin email)'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            ID: {user.id.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {user.name || '(sin nombre)'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.banned ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">
                              🚫 Baneado
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                              ✓ Activo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            {user.banned ? (
                              <button
                                onClick={() => doAction(user.id, 'unban')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                              >
                                {actionLoading === user.id ? '⏳' : '🔓 Desbanear'}
                              </button>
                            ) : (
                              <button
                                onClick={() => doAction(user.id, 'ban')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                              >
                                {actionLoading === user.id ? '⏳' : '🚫 Banear'}
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