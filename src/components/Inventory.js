// src/components/Navigation.js
import React from 'react';

const Navigation = ({ activeModule, setActiveModule }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Wings <span>Cafe</span></h2>
      </div>
      <div 
        className={`menu-item ${activeModule === 'dashboard' ? 'active' : ''}`} 
        onClick={() => setActiveModule('dashboard')}
      >
        <i className="fas fa-th-large"></i>
        <span>Dashboard</span>
      </div>
      <div 
        className={`menu-item ${activeModule === 'products' ? 'active' : ''}`} 
        onClick={() => setActiveModule('products')}
      >
        <i className="fas fa-utensils"></i>
        <span>Products</span>
      </div>
      <div 
        className={`menu-item ${activeModule === 'inventory' ? 'active' : ''}`} 
        onClick={() => setActiveModule('inventory')}
      >
        <i className="fas fa-boxes"></i>
        <span>Inventory</span>
      </div>
      <div 
        className={`menu-item ${activeModule === 'sales' ? 'active' : ''}`} 
        onClick={() => setActiveModule('sales')}
      >
        <i className="fas fa-shopping-cart"></i>
        <span>Sales</span>
      </div>
      <div 
        className={`menu-item ${activeModule === 'customers' ? 'active' : ''}`} 
        onClick={() => setActiveModule('customers')}
      >
        <i className="fas fa-users"></i>
        <span>Customers</span>
      </div>
      <div 
        className={`menu-item ${activeModule === 'reports' ? 'active' : ''}`} 
        onClick={() => setActiveModule('reports')}
      >
        <i className="fas fa-chart-bar"></i>
        <span>Reports</span>
      </div>
    </div>
  );
};

export default Navigation;