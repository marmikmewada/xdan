"use client"
import { useEffect, useState } from 'react';



function OrdersTransection() {

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await fetch(`/api/getalltransections`);
            const data = await response.json();
            console.log("data",data)
    
            if (response.ok) {
            //   setOrders(data.orders || []);
            } else {
              throw new Error(data.message || 'Failed to fetch orders');
            }
          } catch (err) {
            // setError(err.message);
          }
        };
    
        fetchOrders();
      }, []);

  return (
    <div>ordersTransection</div>
  )
}

export default OrdersTransection