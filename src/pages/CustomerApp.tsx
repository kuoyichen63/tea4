import React, { useState } from 'react';
import { useAuth, useIsAdmin } from '../context/AuthContext';
import { useCartStore } from '../store/useCartStore';
import { useOrders } from '../hooks/useOrders';
import { MENU_CATEGORIES, MENU_ITEMS, MenuItem } from '../data/menu';
import { ShoppingCart, User, Plus, Minus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function CustomerApp() {
  const { user, authError, clearAuthError, signIn, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const cart = useCartStore();
  const { orders, loading, createOrder } = useOrders(false);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [customerName, setCustomerName] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      alert('自動登入中，請稍後');
      return;
    }
    await createOrder(customerName.trim() || '顧客', cart.items, cart.totalAmount());
    cart.clearCart();
    setCustomerName('');
    setIsCartOpen(false);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans">
      <header className="bg-green-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-wider">阿嬤慢熬鳳梨茶飲</h1>
            {isAdmin && <Link to="/admin" className="ml-4 text-xs bg-green-600 px-2 py-1 rounded">Admin</Link>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setActiveTab('menu')}
                className={clsx("text-sm", activeTab === 'menu' && "font-bold underline")}
              >
                Menu
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={clsx("text-sm", activeTab === 'orders' && "font-bold underline")}
              >
                Orders
              </button>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2"
            >
              <ShoppingCart size={24} />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {authError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 max-w-4xl mx-auto flex justify-between items-center" role="alert">
          <p>{authError}</p>
          <button onClick={clearAuthError} className="text-red-700 font-bold hover:text-red-900 ml-4">✕</button>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-4 py-8">
        {activeTab === 'menu' ? (
          <div className="space-y-12">
            {MENU_CATEGORIES.map(category => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-green-900 border-b-2 border-green-800 pb-2 mb-6 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
                  {category}
                  <span className="w-3 h-3 rounded-full bg-green-600 ml-2"></span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MENU_ITEMS.filter(item => item.category === category).map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex justify-between items-start border border-orange-100 cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg flex items-center">
                          {item.id === '1' || item.id === '7' ? <span className="text-orange-500 mr-1">✦</span> : null}
                          {item.name}
                        </h3>
                        {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-green-700">${item.price}</span>
                        <div className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Plus size={12} className="mr-1" /> Add
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div>
             <h2 className="text-2xl font-bold text-green-900 mb-6">Your Orders</h2>
             {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
               <div className="space-y-4">
                 {orders.map(order => (
                   <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-500">
                          {order.createdAt ? format(order.createdAt.toDate(), 'yyyy/MM/dd HH:mm') : 'Just now'}
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="space-y-2 mb-4">
                         {order.items.map(item => (
                           <div key={item.cartItemId} className="flex justify-between text-sm">
                              <div>
                                <span className="font-medium">{item.name}</span> x {item.quantity}
                                <div className="text-xs text-gray-500">{item.sweetness}, {item.ice}</div>
                              </div>
                              <div className="font-medium">${item.price * item.quantity}</div>
                           </div>
                         ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                         <span className="font-bold">Total:</span>
                         <span className="font-bold text-green-700">${order.totalAmount}</span>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>

      {/* Item Selection Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={(itemData) => {
           cart.addItem({ ...itemData, menuItemId: selectedItem.id, price: selectedItem.price, name: selectedItem.name });
           setSelectedItem(null);
           setIsCartOpen(true);
        }} />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-green-50 flex justify-between items-center border-b border-green-100">
              <h2 className="text-xl font-bold text-green-900 flex items-center">
                <ShoppingCart className="mr-2" /> Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black font-bold">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {cart.items.length === 0 ? (
                 <div className="text-center text-gray-500 mt-10">Your cart is empty</div>
               ) : cart.items.map(item => (
                 <div key={item.cartItemId} className="flex flex-col gap-2 border-b border-gray-100 pb-4">
                    <div className="flex justify-between font-medium">
                      <span>{item.name}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500">{item.sweetness}, {item.ice}</div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center bg-gray-100 rounded-lg">
                          <button onClick={() => cart.updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"><Minus size={14}/></button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => cart.updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"><Plus size={14}/></button>
                       </div>
                       <button onClick={() => cart.removeItem(item.cartItemId)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <div className="mb-4">
                 <label className="block text-sm font-bold text-gray-700 mb-1">取件人姓名/編號</label>
                 <input 
                   type="text" 
                   value={customerName}
                   onChange={e => setCustomerName(e.target.value)}
                   placeholder="您可以輸入您的稱呼"
                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                 />
               </div>
               <div className="flex justify-between items-center mb-4 text-lg font-bold">
                 <span>Total</span>
                 <span className="text-green-700">${cart.totalAmount()}</span>
               </div>
               <button 
                 onClick={handleCheckout}
                 disabled={cart.items.length === 0}
                 className="w-full bg-green-800 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 hover:bg-green-900 transition-colors"
               >
                 Place Order
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemModal({ item, onClose, onAdd }: { item: MenuItem, onClose: () => void, onAdd: (data: any) => void }) {
  const [sweetness, setSweetness] = useState('正常糖');
  const [ice, setIce] = useState('正常冰');
  const [quantity, setQuantity] = useState(1);

  const sweetnessOptions = ['正常糖', '少糖', '半糖', '微糖', '無糖'];
  const iceOptions = ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'];

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
             <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
             <button onClick={onClose} className="text-gray-400 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold">✕</button>
          </div>
          {item.description && <p className="text-gray-500 mb-6">{item.description}</p>}
          
          <div className="space-y-6">
            <div>
              <label className="font-bold block mb-2 text-gray-800">甜度 (Sweetness)</label>
              <div className="flex flex-wrap gap-2">
                {sweetnessOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setSweetness(opt)}
                    className={clsx("px-4 py-2 rounded-full text-sm border transition-colors", sweetness === opt ? "bg-green-100 border-green-600 text-green-800 font-bold" : "border-gray-200 text-gray-600")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold block mb-2 text-gray-800">冰塊 (Ice)</label>
              <div className="flex flex-wrap gap-2">
                {iceOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setIce(opt)}
                    className={clsx("px-4 py-2 rounded-full text-sm border transition-colors", ice === opt ? "bg-green-100 border-green-600 text-green-800 font-bold" : "border-gray-200 text-gray-600")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
               <span className="font-bold text-xl">${item.price}</span>
               <div className="flex items-center bg-gray-100 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors"><Minus size={16}/></button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors"><Plus size={16}/></button>
               </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
           <button 
             onClick={() => onAdd({ sweetness, ice, quantity })}
             className="w-full bg-green-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-900 transition-colors flex justify-center items-center"
           >
             Add to Cart • ${item.price * quantity}
           </button>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending': return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium flex items-center"><Clock size={12} className="mr-1"/> 待確認</span>;
    case 'preparing': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium flex items-center">製作中</span>;
    case 'ready': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center"><CheckCircle2 size={12} className="mr-1"/> 可取餐</span>;
    case 'completed': return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">已完成</span>;
    default: return null;
  }
}
