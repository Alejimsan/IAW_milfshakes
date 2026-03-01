import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';

export default function ServerStatus({ servers }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Estado de Microservicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(servers).map(([serviceKey, service]) => {
          const serviceName = serviceKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          
          return (
            <div key={serviceKey} className={`border-2 rounded-lg p-4 ${getStatusColor(service.status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(service.status)}
                    <p className="font-semibold text-gray-800">{serviceName}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Uptime:</span> {service.uptime}
                    </p>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">Latencia:</span> {service.latency}ms
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <span className={`text-xs font-semibold ${
                  service.status === 'online' ? 'text-green-700' :
                  service.status === 'warning' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {service.status === 'online' ? '● Online' :
                   service.status === 'warning' ? '● Warning' :
                   '● Offline'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Service Description */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Microservicios:</strong> API Gateway (routing), Catalog Service (productos), Auth Service (autenticación), Strapi CMS (contenido), Database (PostgreSQL), Cache (Redis)
        </p>
      </div>
    </div>
  );
}
