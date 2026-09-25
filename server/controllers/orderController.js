const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// @desc    Get current user's orders (Customer view)
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const customerUserId = userResult.rows[0].id;

    // Fetch orders with store details
    const ordersResult = await db.query(
      `SELECT o.id, o.total_amount, o.order_status, o.payment_status, o.created_at, o.payment_reference, s.name as store_name 
       FROM orders o 
       JOIN stores s ON o.store_id = s.id 
       WHERE o.customer_user_id = $1 AND o.payment_status = 'SUCCESS' 
       ORDER BY o.created_at DESC`,
      [customerUserId]
    );

    res.json({ success: true, orders: ordersResult.rows });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

// @desc    Update order status (Vendor or Customer)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { userId } = getAuth(req);
  const orderId = req.params.id;
  const { status } = req.body; // 'PENDING', 'DELIVERED', 'CANCELLED'

  if (!['PENDING', 'DELIVERED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  try {
    const userResult = await db.query('SELECT id, role FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    
    const dbUser = userResult.rows[0];

    // Fetch the order to check permissions
    const orderResult = await db.query(
      `SELECT o.customer_user_id, s.owner_user_id 
       FROM orders o 
       JOIN stores s ON o.store_id = s.id 
       WHERE o.id = $1`, 
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderResult.rows[0];

    // Authorization checks
    if (dbUser.role === 'CUSTOMER') {
      // Customers can only cancel their own orders
      if (orderData.customer_user_id !== dbUser.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (status !== 'CANCELLED') {
        return res.status(403).json({ error: 'Customers can only cancel orders' });
      }
    } else if (dbUser.role === 'VENDOR') {
      // Vendors can update statuses for their own store's orders
      if (orderData.owner_user_id !== dbUser.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      // Super admins might use this route too later, but for now reject
      return res.status(403).json({ error: 'Role not authorized for this action' });
    }

    // Perform the update
    const updatedOrder = await db.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    res.json({ success: true, order: updatedOrder.rows[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error updating order' });
  }
};

module.exports = {
  getMyOrders,
  updateOrderStatus
};
