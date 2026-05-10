import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';
import { CartItem } from '../store/useCartStore';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: any;
  updatedAt: any;
}

export function useOrders(isAdmin: boolean = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
       setLoading(false);
       return;
    }

    const ordersCol = collection(db, 'orders');
    let q;
    if (isAdmin) {
      q = query(ordersCol, orderBy('createdAt', 'desc'));
    } else {
      q = query(ordersCol, where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, auth.currentUser?.uid]);

  const createOrder = async (customerName: string, items: CartItem[], totalAmount: number) => {
    if (!auth.currentUser) throw new Error('Must be logged in to order');
    
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        customerName,
        items,
        status: 'pending',
        totalAmount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  return { orders, loading, createOrder, updateOrderStatus };
}
