import React, { useState, useEffect } from 'react';
import './components/styles/App.css';

const App = () => {
  // State for products
  const [products, setProducts] = useState([]);
  // State for form inputs
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for active module
  const [activeModule, setActiveModule] = useState('dashboard');
  // State for low stock alert threshold
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  // State for customers
  const [customers, setCustomers] = useState([]);
  // State for customer form
  const [customerForm, setCustomerForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    loyaltyPoints: 0
  });
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  // State for sales
  const [sales, setSales] = useState([]);
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    customerId: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('wingsCafeProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    const savedThreshold = localStorage.getItem('lowStockThreshold');
    if (savedThreshold) {
      setLowStockThreshold(parseInt(savedThreshold));
    }

    const savedCustomers = localStorage.getItem('wingsCafeCustomers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Sample initial customers
      const initialCustomers = [
        {id: "5", name: "Tumo Koloi", email: "Tumo@pham.co.za", phone:"+27 76864325", loyaltyPoints: 25 },
        {id: "4", name: "Sepolo Late", email: "joalaboholo@gov.co.ls", phone:"22334466", loyaltyPoints: 10 },
        { id: "1", name: "Hefa Jekola", email: "Hefa@hotmail.com", phone: "58120001", loyaltyPoints: 120 },
        { id: "2", name: "Patipa Qati", email: "Asera@outlook.com", phone: "5437890", loyaltyPoints: 75 },
        { id: "3", name: "Lineo Nape", email: "Sisera@yahoo.com", phone: "12345678", loyaltyPoints: 200 }
      ];
      setCustomers(initialCustomers);
      localStorage.setItem('wingsCafeCustomers', JSON.stringify(initialCustomers));
    }

    const savedSales = localStorage.getItem('wingsCafeSales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wingsCafeCustomers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('wingsCafeSales', JSON.stringify(sales));
  }, [sales]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle customer form input changes
  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({
      ...customerForm,
      [name]: name === 'loyaltyPoints' ? parseInt(value) || 0 : value
    });
  };

  // Handle sale form input changes
  const handleSaleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleForm({
      ...saleForm,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    });
  };

  // Handle form submission (add or update product)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === formData.id ? {...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity)} : product
      ));
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: Date.now().toString(), // Generate unique ID
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      setProducts([...products, newProduct]);
    }
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: ''
    });
    setIsEditing(false);
  };

  // Handle customer form submission
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    
    if (isEditingCustomer) {
      // Update existing customer
      setCustomers(customers.map(customer => 
        customer.id === customerForm.id ? customerForm : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...customerForm,
        id: Date.now().toString() // Generate unique ID
      };
      setCustomers([...customers, newCustomer]);
    }
    
    // Reset form
    setCustomerForm({
      id: '',
      name: '',
      email: '',
      phone: '',
      loyaltyPoints: 0
    });
    setIsEditingCustomer(false);
  };

  // Handle sale form submission
  const handleSaleSubmit = (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === saleForm.productId);
    const customer = customers.find(c => c.id === saleForm.customerId);
    
    if (!product) {
      alert('Please select a product');
      return;
    }
    
    if (saleForm.quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    if (product.quantity < saleForm.quantity) {
      alert(`Not enough stock. Only ${product.quantity} available.`);
      return;
    }
    
    // Calculate total price
    const totalPrice = product.price * saleForm.quantity;
    
    // Create new sale
    const newSale = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      productId: saleForm.productId,
      productName: product.name,
      quantity: saleForm.quantity,
      customerId: saleForm.customerId,
      customerName: customer ? customer.name : 'Walk-in Customer',
      totalPrice: totalPrice,
      paymentMethod: 'Cash'
    };
    
    // Update sales
    setSales([...sales, newSale]);
    
    // Update product stock
    updateStock(saleForm.productId, -saleForm.quantity);
    
    // Update customer loyalty points if applicable
    if (saleForm.customerId) {
      const updatedCustomers = customers.map(c => {
        if (c.id === saleForm.customerId) {
          return {
            ...c,
            loyaltyPoints: c.loyaltyPoints + Math.floor(totalPrice / 10) // 1 point per M10 spent
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
    }
    
    // Reset form
    setSaleForm({
      productId: '',
      quantity: 1,
      customerId: ''
    });
    
    alert(`Sale recorded: ${saleForm.quantity} x ${product.name} for M${totalPrice.toFixed(2)}`);
  };

  // Set product for editing
  const handleEdit = (product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setIsEditing(true);
  };

  // Set customer for editing
  const handleEditCustomer = (customer) => {
    setCustomerForm(customer);
    setIsEditingCustomer(true);
  };

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // Delete customer
  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  // Delete sale
  const handleDeleteSale = (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  // Update stock quantity
  const updateStock = (id, change) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = parseInt(product.quantity) + change;
        return {
          ...product,
          quantity: newQuantity < 0 ? 0 : newQuantity
        };
      }
      return product;
    }));
  };

  // Get low stock products
  const lowStockProducts = products.filter(product => product.quantity <= lowStockThreshold);

  // Format currency as Maloti
  const formatCurrency = (amount) => {
    return `M${parseFloat(amount).toFixed(2)}`;
  };

  // Get today's sales total
  const getTodaysSalesTotal = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales
      .filter(sale => sale.date === today)
      .reduce((total, sale) => total + sale.totalPrice, 0);
  };

  // Get total inventory value
  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  // Render dashboard module
  const renderDashboard = () => (
    <div className="module">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p>{lowStockProducts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <p>{formatCurrency(getTotalInventoryValue())}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <p>{formatCurrency(getTodaysSalesTotal())}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>{formatCurrency(sales.reduce((total, sale) => total + sale.totalPrice, 0))}</p>
        </div>
      </div>
      
      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning">
          <h3>Low Stock Alert</h3>
          <p>The following products are running low on stock:</p>
          <ul>
            {lowStockProducts.map(product => (
              <li key={product.id}>{product.name} (Only {product.quantity} left)</li>
            ))}
          </ul>
        </div>
      )}

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          {sales.slice(-5).reverse().map(sale => (
            <div key={sale.id} className="activity-item">
              <span className="activity-icon">🛒</span>
              <div className="activity-details">
                <p>Sale: {sale.quantity} x {sale.productName} to {sale.customerName}</p>
                <small>{sale.date} • {formatCurrency(sale.totalPrice)}</small>
              </div>
            </div>
          ))}
          {sales.length === 0 && <p>No recent activities</p>}
        </div>
      </div>
    </div>
  );

  // Render product management module
  const renderProductManagement = () => (
    <div className="module">
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Beverage">Beverage</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (M)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
        {isEditing && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                id: '',
                name: '',
                description: '',
                category: '',
                price: '',
                quantity: ''
              });
              setIsEditing(false);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>
      
      <div className="products-table">
        <h3>Product List</h3>
        {products.length === 0 ? (
          <p>No products found. Add some products to get started.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={product.quantity <= lowStockThreshold ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.quantity === 0 ? (
                      <span className="status out-of-stock">Out of Stock</span>
                    ) : product.quantity <= lowStockThreshold ? (
                      <span className="status low-stock">Low Stock</span>
                    ) : (
                      <span className="status in-stock">In Stock</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                    <button 
                      className="btn btn-sm btn-add-stock"
                      onClick={() => updateStock(product.id, 1)}
                    >
                      +1
                    </button>
                    <button 
                      className="btn btn-sm btn-remove-stock"
                      onClick={() => updateStock(product.id, -1)}
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Render inventory module
  const renderInventory = () => (
    <div className="module">
      <h2>Inventory Management</h2>
      <div className="inventory-controls">
        <div className="form-group">
          <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
          <input
            type="number"
            id="lowStockThreshold"
            value={lowStockThreshold}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0) {
                setLowStockThreshold(value);
                localStorage.setItem('lowStockThreshold', value.toString());
              }
            }}
            min="0"
          />
        </div>
      </div>
      
      <div className="inventory-summary">
        <h3>Inventory Summary</h3>
        {products.length === 0 ? (
          <p>No products in inventory.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Value</th>
                <th>Stock Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={product.quantity <= lowStockThreshold ? 'low-stock' : ''}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.quantity === 0 ? (
                      <span className="status out-of-stock">Out of Stock</span>
                    ) : product.quantity <= lowStockThreshold ? (
                      <span className="status low-stock">Low Stock</span>
                    ) : (
                      <span className="status in-stock">In Stock</span>
                    )}
                  </td>
                  <td>{formatCurrency(product.price * product.quantity)}</td>
                  <td>
                    <div className="stock-actions">
                      <input 
                        type="number" 
                        min="1" 
                        defaultValue="1" 
                        id={`add-${product.id}`} 
                        className="stock-input"
                      />
                      <button 
                        className="btn btn-sm btn-add-stock"
                        onClick={() => {
                          const input = document.getElementById(`add-${product.id}`);
                          const value = parseInt(input.value);
                          if (!isNaN(value) && value > 0) {
                            updateStock(product.id, value);
                            input.value = '1';
                          }
                        }}
                      >
                        Add Stock
                      </button>
                      <button 
                        className="btn btn-sm btn-remove-stock"
                        onClick={() => {
                          const input = document.getElementById(`add-${product.id}`);
                          const value = parseInt(input.value);
                          if (!isNaN(value) && value > 0) {
                            updateStock(product.id, -value);
                            input.value = '1';
                          }
                        }}
                      >
                        Remove Stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Render sales module
  const renderSales = () => (
    <div className="module">
      <h2>Sales Management</h2>
      <div className="sales-container">
        <div className="sales-form">
          <h3>Record Sale</h3>
          <form onSubmit={handleSaleSubmit}>
            <div className="form-group">
              <label htmlFor="saleProduct">Select Product</label>
              <select
                id="saleProduct"
                name="productId"
                value={saleForm.productId}
                onChange={handleSaleInputChange}
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({formatCurrency(product.price)}, Stock: {product.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="saleQuantity">Quantity</label>
              <input 
                type="number" 
                id="saleQuantity"
                name="quantity"
                value={saleForm.quantity}
                onChange={handleSaleInputChange}
                min="1" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="saleCustomer">Customer (Optional)</label>
              <select
                id="saleCustomer"
                name="customerId"
                value={saleForm.customerId}
                onChange={handleSaleInputChange}
              >
                <option value="">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.loyaltyPoints} points)
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Record Sale
            </button>
          </form>
        </div>
        
        <div className="sales-summary">
          <h3>Sales History</h3>
          {sales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice().reverse().map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.date}</td>
                    <td>{sale.productName}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.customerName}</td>
                    <td>{formatCurrency(sale.totalPrice)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteSale(sale.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  // Render customer module
  const renderCustomer = () => (
    <div className="module">
      <h2>Customer Management</h2>
      
      <form onSubmit={handleCustomerSubmit} className="customer-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input
              type="text"
              id="customerName"
              name="name"
              value={customerForm.name}
              onChange={handleCustomerInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input
              type="email"
              id="customerEmail"
              name="email"
              value={customerForm.email}
              onChange={handleCustomerInputChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerPhone">Phone</label>
            <input
              type="tel"
              id="customerPhone"
              name="phone"
              value={customerForm.phone}
              onChange={handleCustomerInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerLoyalty">Loyalty Points</label>
            <input
              type="number"
              id="customerLoyalty"
              name="loyaltyPoints"
              value={customerForm.loyaltyPoints}
              onChange={handleCustomerInputChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">
          {isEditingCustomer ? 'Update Customer' : 'Add Customer'}
        </button>
        {isEditingCustomer && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setCustomerForm({
                id: '',
                name: '',
                email: '',
                phone: '',
                loyaltyPoints: 0
              });
              setIsEditingCustomer(false);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>
      
      <div className="customers-table">
        <h3>Customer List ({customers.length})</h3>
        {customers.length === 0 ? (
          <p>No customers found. Add some customers to get started.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Loyalty Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.loyaltyPoints}</td>
                  <td>
                    {customer.loyaltyPoints >= 100 ? (
                      <span className="status gold-member">Gold Member</span>
                    ) : customer.loyaltyPoints >= 50 ? (
                      <span className="status silver-member">Silver Member</span>
                    ) : (
                      <span className="status standard-member">Standard Member</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // Render reporting module
  const renderReporting = () => {
    const totalSalesValue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
    const totalInventoryValue = getTotalInventoryValue();
    const todaysSales = getTodaysSalesTotal();
    
    return (
      <div className="module">
        <h2>Reporting & Analytics</h2>
        <div className="reports-container">
          <div className="report-card">
            <h3>Financial Summary</h3>
            <div className="financial-summary">
              <div className="financial-item">
                <span className="label">Total Sales Value:</span>
                <span className="value">{formatCurrency(totalSalesValue)}</span>
              </div>
              <div className="financial-item">
                <span className="label">Total Inventory Value:</span>
                <span className="value">{formatCurrency(totalInventoryValue)}</span>
              </div>
              <div className="financial-item">
                <span className="label">Today's Sales:</span>
                <span className="value">{formatCurrency(todaysSales)}</span>
              </div>
            </div>
          </div>
          
          <div className="report-card">
            <h3>Inventory Value by Category</h3>
            <div className="chart-container">
              {[...new Set(products.map(p => p.category))].map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                const totalValue = categoryProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
                const percentage = (totalValue / (totalInventoryValue || 1)) * 100;
                
                return (
                  <div key={category} className="chart-bar">
                    <div className="chart-label">{category}</div>
                    <div className="chart-bar-outer">
                      <div 
                        className="chart-bar-inner" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="chart-value">{formatCurrency(totalValue)} ({percentage.toFixed(1)}%)</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="report-card">
            <h3>Stock Status</h3>
            <div className="stock-status">
              <p>Total Products: {products.length}</p>
              <p>In Stock: {products.filter(p => p.quantity > lowStockThreshold).length}</p>
              <p>Low Stock: {lowStockProducts.length}</p>
              <p>Out of Stock: {products.filter(p => p.quantity === 0).length}</p>
            </div>
          </div>

          <div className="report-card">
            <h3>Customer Loyalty</h3>
            <div className="loyalty-status">
              <p>Total Customers: {customers.length}</p>
              <p>Gold Members (100+ points): {customers.filter(c => c.loyaltyPoints >= 100).length}</p>
              <p>Silver Members (50-99 points): {customers.filter(c => c.loyaltyPoints >= 50 && c.loyaltyPoints < 100).length}</p>
              <p>Standard Members: {customers.filter(c => c.loyaltyPoints < 50).length}</p>
            </div>
          </div>

          <div className="report-card">
            <h3>Top Selling Products</h3>
            <div className="top-products">
              {sales.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      sales.reduce((acc, sale) => {
                        acc[sale.productId] = acc[sale.productId] || { name: sale.productName, quantity: 0, revenue: 0 };
                        acc[sale.productId].quantity += sale.quantity;
                        acc[sale.productId].revenue += sale.totalPrice;
                        return acc;
                      }, {})
                    )
                    .sort((a, b) => b[1].revenue - a[1].revenue)
                    .slice(0, 5)
                    .map(([id, data]) => (
                      <tr key={id}>
                        <td>{data.name}</td>
                        <td>{data.quantity}</td>
                        <td>{formatCurrency(data.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No sales data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the active module based on state
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProductManagement();
      case 'inventory':
        return renderInventory();
      case 'sales':
        return renderSales();
      case 'customers':
        return renderCustomer();
      case 'reporting':
        return renderReporting();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h3>Tumo Koloi 901019458</h3>
        <h1>Wings Cafe Inventory System</h1>
        <p>Manage the product inventory, sales, and customers</p>
      </header>
      
      <nav className="main-nav">
        <button 
          className={activeModule === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeModule === 'products' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('products')}
        >
         Products
        </button>
        <button 
          className={activeModule === 'inventory' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('inventory')}
        >
           Inventory
        </button>
        <button 
          className={activeModule === 'sales' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('sales')}
        >
          Sales
        </button>
        <button 
          className={activeModule === 'customers' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('customers')}
        >
         Customers
        </button>
        <button 
          className={activeModule === 'reporting' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveModule('reporting')}
        >
         Reporting
        </button>
      </nav>
      
      <main className="main-content">
        {renderActiveModule()}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Wings Cafe Inventory System | Developed by Tumo Koloi</p>
      </footer>
    </div>
  );
};

export default App;