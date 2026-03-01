import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function OrdersList({ orders }) {
  const statusConfig = {
    completed: { color: 'bg-green-100', textColor: 'text-green-800', label: '✓ Completado' },
    processing: { color: 'bg-blue-100', textColor: 'text-blue-800', label: '⏳ Procesando' },
    pending: { color: 'bg-yellow-100', textColor: 'text-yellow-800', label: '⏸ Pendiente' },
    shipped: { color: 'bg-purple-100', textColor: 'text-purple-800', label: '📦 Enviado' },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Pedidos Recientes</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID Pedido</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const status = statusConfig[order.status];
              return (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.textColor}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{order.date}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                      Ver <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
