import React, { useState, useEffect } from 'react';
import { 
  Home, ShoppingBag, Users, Settings, LogOut, Menu, X,
  TrendingUp, DollarSign, Package, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Sidebar from './components/Sidebar';
import DashboardMetrics from './components/DashboardMetrics';
import SalesChart from './components/SalesChart';
import OrdersList from './components/OrdersList';
import ServerStatus from './components/ServerStatus';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demo
  const mockMetrics = {
    totalSales: 45230.50,
    totalOrders: 342,
    totalProducts: 127,
    activeUsers: 1245,
    salesChange: 12.5,
    ordersChange: 8.3,
    productsChange: 2.1,
    usersChange: -3.2
  };

  const mockSalesData = [
    { date: 'Mar 01', sales: 2400, revenue: 2400 },
    { date: 'Mar 02', sales: 1398, revenue: 2210 },
    { date: 'Mar 03', sales: 9800, revenue: 2290 },
    { date: 'Mar 04', sales: 3908, revenue: 2000 },
    { date: 'Mar 05', sales: 4800, revenue: 2181 },
    { date: 'Mar 06', sales: 3800, revenue: 2500 },
    { date: 'Mar 07', sales: 4300, revenue: 2100 }
  ];

  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'Juan García',
      total: 125.50,
      status: 'completed',
      date: '2026-03-01'
    },
    {
      id: 'ORD-002',
      customer: 'María López',
      total: 89.99,
      status: 'processing',
      date: '2026-03-01'
    },
    {
      id: 'ORD-003',
      customer: 'Carlos Rodríguez',
      total: 245.00,
      status: 'pending',
      date: '2026-03-02'
    },
    {
      id: 'ORD-004',
      customer: 'Ana Martínez',
      total: 56.75,
      status: 'completed',
      date: '2026-03-02'
    },
    {
      id: 'ORD-005',
      customer: 'Pedro Sánchez',
      total: 330.25,
      status: 'shipped',
      date: '2026-03-03'
    }
  ];

  const mockServerStatus = {
    apiGateway: { status: 'online', uptime: '99.95%', latency: 45 },
    catalogService: { status: 'online', uptime: '99.98%', latency: 32 },
    authService: { status: 'online', uptime: '99.99%', latency: 28 },
    strapiCMS: { status: 'online', uptime: '99.92%', latency: 52 },
    database: { status: 'online', uptime: '99.99%', latency: 15 },
    cache: { status: 'online', uptime: '99.97%', latency: 8 }
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setDashboardData({
        metrics: mockMetrics,
        sales: mockSalesData,
        orders: mockOrders,
        servers: mockServerStatus
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeSection === 'overview' && 'Dashboard'}
                {activeSection === 'products' && 'Productos'}
                {activeSection === 'orders' && 'Pedidos'}
                {activeSection === 'users' && 'Usuarios'}
                {activeSection === 'servers' && 'Estado de Servidores'}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  AD
                </div>
                <span className="text-sm text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'overview' && dashboardData && (
            <div className="space-y-6">
              {/* Metrics */}
              <DashboardMetrics metrics={dashboardData.metrics} />

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart data={dashboardData.sales} />
                
                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Productos Destacados</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Hoodie Negro', sales: 245, revenue: 5887.50 },
                      { name: 'Pants Gris', sales: 189, revenue: 4556.25 },
                      { name: 'Camiseta Blanca', sales: 156, revenue: 2496.00 },
                      { name: 'Jacket Denim', sales: 98, revenue: 2940.00 }
                    ].map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} ventas</p>
                        </div>
                        <p className="font-semibold text-green-600">${product.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <OrdersList orders={dashboardData.orders} />

              {/* Server Status */}
              <ServerStatus servers={dashboardData.servers} />
            </div>
          )}

          {activeSection === 'products' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
              <p className="text-gray-600">Integración con Strapi CMS</p>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">Los productos se gestionan desde el panel de Strapi en http://localhost:1337/admin</p>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Todos los Pedidos</h2>
              <OrdersList orders={dashboardData.orders} />
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
              <div className="space-y-3">
                {[
                  { id: 1, name: 'Juan García', email: 'juan@example.com', role: 'Cliente', joined: '2026-01-15' },
                  { id: 2, name: 'María López', email: 'maria@example.com', role: 'Cliente', joined: '2026-01-20' },
                  { id: 3, name: 'Carlos Admin', email: 'carlos@milfshakes.es', role: 'Admin', joined: '2026-01-01' }
                ].map(user => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Desde {user.joined}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'servers' && dashboardData && (
            <ServerStatus servers={dashboardData.servers} />
          )}
        </div>
      </div>
    </div>
  );
}
