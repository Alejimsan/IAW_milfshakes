import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

export default function DashboardMetrics({ metrics }) {
  const metricCards = [
    {
      title: 'Ventas Totales',
      value: `$${metrics.totalSales.toFixed(2)}`,
      change: metrics.salesChange,
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pedidos',
      value: metrics.totalOrders,
      change: metrics.ordersChange,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Productos',
      value: metrics.totalProducts,
      change: metrics.productsChange,
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Usuarios Activos',
      value: metrics.activeUsers.toLocaleString(),
      change: metrics.usersChange,
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, idx) => {
        const Icon = metric.icon;
        const isPositive = metric.change > 0;
        
        return (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {Math.abs(metric.change).toFixed(1)}%
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{metric.value}</p>
            <p className={`text-xs mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(metric.change).toFixed(1)}% vs. mes anterior
            </p>
          </div>
        );
      })}
    </div>
  );
}
