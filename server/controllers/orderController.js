const db = require('../config/db');

// Place order (online — with login)
const placeOrder = async (req, res) => {
  try {
    const { items, delivery_type, address, contact_number, payment_method, total_amount } = req.body;
    const user_id = req.user.id;

    const [result] = await db.query(
      'INSERT INTO orders (user_id, guest_name, total_amount, delivery_type, address, contact_number, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, null, total_amount, delivery_type, address, contact_number, payment_method]
    );

    const order_id = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, extra_egg, extra_rice) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price, item.extra_egg || 0, item.extra_rice || 0]
      );
    }

    res.status(201).json({ message: 'Order placed successfully!', order_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Place guest order (POS — no login needed)
const placeGuestOrder = async (req, res) => {
  try {
    const { items, delivery_type, contact_number, payment_method, total_amount, guest_name } = req.body;

    const [result] = await db.query(
      'INSERT INTO orders (user_id, guest_name, total_amount, delivery_type, address, contact_number, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [null, guest_name, total_amount, delivery_type || 'pickup', '', contact_number || '', payment_method]
    );

    const order_id = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, extra_egg, extra_rice) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price, item.extra_egg || 0, item.extra_rice || 0]
      );
    }

    res.status(201).json({ message: 'Order placed successfully!', order_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Cancel order (customer — pending only)
const cancelOrder = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orders[0];

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order can no longer be cancelled.' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: 'Order cancelled successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Get my orders (customer)
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orders[0];
    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        CASE WHEN o.user_id IS NOT NULL THEN u.name ELSE o.guest_name END as customer_name,
        CASE WHEN o.user_id IS NOT NULL THEN u.email ELSE 'Walk-In' END as customer_email
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Get stats (admin dashboard)
const getStats = async (req, res) => {
  try {
    const [[{ total_orders }]] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await db.query('SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status != "cancelled"');
    const [[{ total_customers }]] = await db.query('SELECT COUNT(*) as total_customers FROM users WHERE role = "customer"');
    const [[{ total_products }]] = await db.query('SELECT COUNT(*) as total_products FROM products');
    const [recent_orders] = await db.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at,
        CASE WHEN o.user_id IS NOT NULL THEN u.name ELSE o.guest_name END as customer_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    res.json({ total_orders, total_revenue, total_customers, total_products, recent_orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { placeOrder, placeGuestOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getStats, cancelOrder };