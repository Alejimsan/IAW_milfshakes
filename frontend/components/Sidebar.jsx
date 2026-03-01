import React from 'react';
import { Home, ShoppingBag, Users, Server, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, activeSection, onSectionChange }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'servers', label: 'Servidores', icon: Server },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-lg`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
            MS
          </div>
          {isOpen && <span className="ml-3 font-bold text-lg">MilfShakes</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition`}>
          <Settings className="w-5 h-5" />
          {isOpen && <span>Configuración</span>}
        </button>
        <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition`}>
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
