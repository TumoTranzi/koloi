// src/components/Dashboard.js
import React from 'react';

const Dashboard = ({ products, sales }) => {
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity < 10).length;
  const todaySales = sales.filter(s => s.date === '2023-10-15').reduce((sum, sale) => sum + sale.total, 0);
  const totalCustomers = 128; // This would come from API in a real app

  // Calculate total inventory value
  const totalInventoryValue = products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);

  // Get recent transactions (last 5)
  const recentTransactions = [
    { product: 'Espresso', category: 'Beverages', type: 'Sale', quantity: -5, date: 'Oct 15, 2023' },
    { product: 'Chicken Wings', category: 'Food', type: 'Restock', quantity: +50, date: 'Oct 15, 2023' },
    { product: 'Chocolate Cake', category: 'Desserts', type: 'Sale', quantity: -3, date: 'Oct 14, 2023' },
    { product: 'Iced Coffee', category: 'Beverages', type: 'Sale', quantity: -8, date: 'Oct 14, 2023' },
    { product: 'French Fries', category: 'Food', type: 'Restock', quantity: +30, date: 'Oct 13, 2023' }
  ];

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="User" />
          <span>Admin User</span>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Products</h3>
            <div className="card-icon">
              <i className="fas fa-utensils"></i>
            </div>
          </div>
          <div className="card-value">{totalProducts}</div>
          <div className="card-text">Active products in inventory</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Low Stock Items</h3>
            <div className="card-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="card-value">{lowStockItems}</div>
          <div className="card-text">Items needing restock</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Sales</h3>
            <div className="card-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="card-value">₦{todaySales.toLocaleString()}</div>
          <div className="card-text">Revenue generated today</div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Customers</h3>
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="card-value">{totalCustomers}</div>
          <div className="card-text">Registered customers</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Inventory Value</h3>
            <div className="card-icon">
              <i className="fas fa-boxes"></i>
            </div>
          </div>
          <div className="card-value">₦{totalInventoryValue.toLocaleString()}</div>
          <div className="card-text">Total value of inventory</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Sales</h3>
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="card-value">{sales.length}</div>
          <div className="card-text">Completed transactions</div>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Recent Stock Transactions</h2>
          <button className="btn btn-primary">View All</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Transaction</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.product}</td>
                <td>{transaction.category}</td>
                <td>{transaction.type}</td>
                <td className={transaction.quantity > 0 ? 'high-stock' : 'low-stock'}>
                  {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                </td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Low Stock Alert</h2>
          <button className="btn btn-primary">Order Supplies</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(product => product.quantity < 10)
              .map(product => (
                <tr key={product.id} className="low-stock">
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category}</td>
                  <td>₦{product.price.toLocaleString()}</td>
                  <td>Needs Restock</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;