import React, { useState, useEffect } from 'react';
import './components/styles/App.css';

const App = () => {
  //  STATE MANAGEMENT 

  // List of all products
  const [products, setProducts] = useState([]);
  
  // Product form data (used for add/edit)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  // Track whether we are editing a product or adding a new one
  const [isEditing, setIsEditing] = useState(false);

  // Track which module/page is currently active (dashboard, products, etc.)
  const [activeModule, setActiveModule] = useState('dashboard');

  // Low stock threshold (default is 10 items)
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // List of customers
  const [customers, setCustomers] = useState([]);

  // Customer form data (for add/edit customer)
  const [customerForm, setCustomerForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    loyaltyPoints: 0
  });

  // Track whether we are editing a customer
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  // Sales history
  const [sales, setSales] = useState([]);

  // Sale form data (for recording a sale)
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    customerId: ''
  });

  //  DATA PERSISTENCE 

  // Load data from localStorage when component mounts
  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('wingsCafeProducts');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    // Load threshold
    const savedThreshold = localStorage.getItem('lowStockThreshold');
    if (savedThreshold) setLowStockThreshold(parseInt(savedThreshold));

    // Load customers or initialize with sample data
    const savedCustomers = localStorage.getItem('wingsCafeCustomers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Add sample customers
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

    // Load sales history
    const savedSales = localStorage.getItem('wingsCafeSales');
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
  }, [products]);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wingsCafeCustomers', JSON.stringify(customers));
  }, [customers]);

  // Save sales to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wingsCafeSales', JSON.stringify(sales));
  }, [sales]);

  //  FORM HANDLERS 

  // Handle product form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  // Handle customer form input
  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({
      ...customerForm,
      [name]: name === 'loyaltyPoints' ? parseInt(value) || 0 : value
    });
  };

  // Handle sale form input
  const handleSaleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleForm({
      ...saleForm,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    });
  };

  // SUBMIT HANDLERS 

  // Submit product form (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update product
      setProducts(products.map(product =>
        product.id === formData.id
          ? {...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity)}
          : product
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
    setFormData({id: '', name: '', description: '', category: '', price: '', quantity: ''});
    setIsEditing(false);
  };

  // Submit customer form
  const handleCustomerSubmit = (e) => {
    e.preventDefault();

    if (isEditingCustomer) {
      // Update customer
      setCustomers(customers.map(customer =>
        customer.id === customerForm.id ? customerForm : customer
      ));
    } else {
      // Add new customer
      const newCustomer = {...customerForm, id: Date.now().toString()};
      setCustomers([...customers, newCustomer]);
    }

    // Reset form
    setCustomerForm({id: '', name: '', email: '', phone: '', loyaltyPoints: 0});
    setIsEditingCustomer(false);
  };

  // Submit sale form
  const handleSaleSubmit = (e) => {
    e.preventDefault();

    // Find product and customer
    const product = products.find(p => p.id === saleForm.productId);
    const customer = customers.find(c => c.id === saleForm.customerId);

    // Validate sale
    if (!product) return alert('Please select a product');
    if (saleForm.quantity <= 0) return alert('Please enter a valid quantity');
    if (product.quantity < saleForm.quantity) return alert(`Not enough stock. Only ${product.quantity} available.`);

    // Calculate total price
    const totalPrice = product.price * saleForm.quantity;

    // Create sale record
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

    // Update sales list
    setSales([...sales, newSale]);

    // Update stock
    updateStock(saleForm.productId, -saleForm.quantity);

    // Add loyalty points if customer exists
    if (saleForm.customerId) {
      const updatedCustomers = customers.map(c =>
        c.id === saleForm.customerId
          ? {...c, loyaltyPoints: c.loyaltyPoints + Math.floor(totalPrice / 10)}
          : c
      );
      setCustomers(updatedCustomers);
    }

    // Reset sale form
    setSaleForm({productId: '', quantity: 1, customerId: ''});

    // Notify user
    alert(`Sale recorded: ${saleForm.quantity} x ${product.name} for M${totalPrice.toFixed(2)}`);
  };

  //  UTILITY FUNCTIONS 

  // Set product for editing
  const handleEdit = (product) => {
    setFormData({...product, price: product.price.toString(), quantity: product.quantity.toString()});
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

  // Update stock by product ID
  const updateStock = (id, change) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = parseInt(product.quantity) + change;
        return {...product, quantity: newQuantity < 0 ? 0 : newQuantity};
      }
      return product;
    }));
  };

  // Get products with stock below threshold
  const lowStockProducts = products.filter(product => product.quantity <= lowStockThreshold);

  // Format amount into currency (Maloti)
  const formatCurrency = (amount) => `M${parseFloat(amount).toFixed(2)}`;

  // Calculate today’s total sales
  const getTodaysSalesTotal = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter(sale => sale.date === today).reduce((total, sale) => total + sale.totalPrice, 0);
  };

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  // MODULE RENDERERS 
  // (Dashboard, Product Management, Inventory, Sales, Customers, Reporting, etc.)
  // Each render function returns the respective JSX layout

  // APP RENDER 
  return (
    <div className="app">
      <header className="app-header">
        <h3>Tumo Koloi 901019458</h3>
        <h1>Wings Cafe Inventory System</h1>
        <p>Manage the product inventory, sales, and customers</p>
      </header>

      {/* Navigation Menu */}
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

      {/* Render whichever module is active */}
      {renderActiveModule()}
    </div>
  );
};

export default App;
