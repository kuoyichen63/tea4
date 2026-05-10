import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { LogOut, LayoutDashboard, Clock, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function AdminApp() {
  const { signOut } = useAuth();
  const { orders, loading, updateOrderStatus } = useOrders(true);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const displayOrders = filter === 'active' ? activeOrders : completedOrders;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider">阿嬤慢熬鳳梨茶飲</h1>
          <p className="text-gray-400 text-sm mt-1">Staff Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <button 
             onClick={() => setFilter('active')}
             className={clsx("w-full flex items-center p-3 rounded-lg transition-colors", filter === 'active' ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800")}
           >
             <Clock className="mr-3" size={20} /> Active Orders
             {activeOrders.length > 0 && <span className="ml-auto bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold">{activeOrders.length}</span>}
           </button>
           <button 
             onClick={() => setFilter('completed')}
             className={clsx("w-full flex items-center p-3 rounded-lg transition-colors", filter === 'completed' ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800")}
           >
             <CheckCircle2 className="mr-3" size={20} /> Completed History
           </button>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
           <Link to="/" className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
             <LayoutDashboard className="mr-3" size={20} /> View Storefront
           </Link>
           <button onClick={signOut} className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors">
             <LogOut className="mr-3" size={20} /> Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 h-screen overflow-y-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{filter === 'active' ? 'Active Orders' : 'Completed Orders'}</h2>
            <p className="text-gray-500 mt-1">Manage current wait queue and fulfillment.</p>
          </div>
        </header>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : displayOrders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500">
            No {filter} orders right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {displayOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className={clsx("p-4 border-b flex justify-between items-center", 
                   order.status === 'pending' ? "bg-orange-50 border-orange-100" :
                   order.status === 'preparing' ? "bg-blue-50 border-blue-100" :
                   order.status === 'ready' ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-200"
                )}>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Order #{order.id.slice(-5).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500">{order.createdAt ? format(order.createdAt.toDate(), 'HH:mm') : 'Just now'}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                
                <div className="p-4 flex-1">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium">Qty</th>
                        <th className="pb-2 font-medium text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map(item => (
                        <tr key={item.cartItemId}>
                          <td className="py-3">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.sweetness}, {item.ice}</div>
                          </td>
                          <td className="py-3 text-gray-700">{item.quantity}</td>
                          <td className="py-3 text-right text-gray-700">${item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="font-bold text-gray-900">Total: ${order.totalAmount}</div>
                  
                  {order.status === 'pending' && (
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
                      Accept & Prepare <ChevronRight size={16} className="ml-1"/>
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
                      Mark Ready <ChevronRight size={16} className="ml-1"/>
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors">
                      <Check size={16} className="mr-1"/> Complete Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending': return <div className="mt-1 text-xs font-bold text-orange-600 uppercase">Pending</div>;
    case 'preparing': return <div className="mt-1 text-xs font-bold text-blue-600 uppercase">Preparing</div>;
    case 'ready': return <div className="mt-1 text-xs font-bold text-green-600 uppercase">Ready</div>;
    default: return <div className="mt-1 text-xs font-bold text-gray-500 uppercase">Completed</div>;
  }
}
