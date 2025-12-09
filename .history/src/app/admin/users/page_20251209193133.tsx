'use client';
import { useState, useEffect } from 'react';

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
  }, []);

  // Ejecutar acción (ban/unban/delete)
  async function doAction(id: string, action: 'ban' | 'unban' | 'delete') {
    // Confirmación extra para delete (¡es permanente! ☠️)
    if (action === 'delete') {
      const confirmed = confirm(
        '⚠️ ¿ELIMINAR USUARIO DEFINITIVAMENTE?\n\nEsta acción NO se puede deshacer.\n\n¿Estás 100% seguro?'
      );
      if (!confirmed) return;
    }

    setActionLoading(id);
    
    try {
      let res;
      
      if (action === 'delete') {
        res = await fetch(`/api/admin/users/${id}`, { 
          method: 'DELETE' 
        });
      } else {
        res = await fetch(`/api/admin/users/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al ejecutar la acción');
      }

      // Recargar lista de usuarios
      await loadUsers();
      
      // Feedback visual
      alert(`✅ Usuario ${action === 'delete' ? 'eliminado' : action === 'ban' ? 'baneado' : 'desbaneado'} con éxito`);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              👥 Gestión de Usuarios
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Total: {users.length} usuario{users.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No hay usuarios para mostrar
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email || '(sin email)'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          {user.banned ? (
                            <button
                              onClick={() => doAction(user.id, 'unban')}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                            >
                              {actionLoading === user.id ? '...' : '🔓 Desbanear'}
                            </button>
                          ) : (
                            <button
                              onClick={() => doAction(user.id, 'ban')}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                            >
                              {actionLoading === user.id ? '...' : '🚫 Banear'}
                            </button>
                          )}
                          <button
                            onClick={() => doAction(user.id, 'delete')}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                          >
                            {actionLoading === user.id ? '...' : '🗑️ Eliminar'}
                          </button>
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
  );
}
