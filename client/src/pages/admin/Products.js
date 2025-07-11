import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  categoryId: '',
  subcategory: '',
  brand: '',
  description: '',
  images: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});
  const [updating, setUpdating] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/products?limit=100');
        setProducts(res.data.products || []);
      } catch (err) {}
      setLoading(false);
    };
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data || []);
      } catch {}
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleStockChange = (id, value) => {
    setEditingStock(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateStock = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      const stock = Number(editingStock[id]);
      await axios.patch(`/api/products/${id}/stock`, { stock });
      setProducts(products => products.map(p => p.id === id ? { ...p, stock } : p));
      window.dispatchEvent(new Event('refreshProducts'));
    } catch (err) {}
    setUpdating(prev => ({ ...prev, [id]: false }));
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subcategory: product.subcategory,
      brand: product.brand,
      description: product.description,
      images: [],
    });
    setEditId(product.id);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm(f => ({ ...f, images: files }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products => products.filter(p => p.id !== id));
      window.dispatchEvent(new Event('refreshProducts'));
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') {
          for (let i = 0; i < v.length; i++) formData.append('images', v[i]);
        } else {
          formData.append(k, v);
        }
      });
      let res;
      if (editId) {
        res = await axios.put(`/api/products/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(products => products.map(p => p.id === editId ? res.data : p));
      } else {
        res = await axios.post('/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(products => [res.data, ...products]);
      }
      setShowModal(false);
      window.dispatchEvent(new Event('refreshProducts'));
    } catch {}
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Products</h1>
        <button className="mb-4 bg-green-600 text-white px-4 py-2 rounded" onClick={openAddModal}>Tambah Produk</button>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">Stok</th>
                  <th className="px-4 py-2 border">Kategori</th>
                  <th className="px-4 py-2 border">Harga</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 border">{product.id}</td>
                    <td className="px-4 py-2 border">{product.name}</td>
                    <td className="px-4 py-2 border">{product.stock}</td>
                    <td className="px-4 py-2 border">{product.categoryName}</td>
                    <td className="px-4 py-2 border">Rp{Number(product.price).toLocaleString()}</td>
                    <td className="px-4 py-2 border">
                      <button className="bg-blue-600 text-white px-2 py-1 rounded mr-2" onClick={() => openEditModal(product)}>Edit</button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(product.id)}>Hapus</button>
                      <input
                        type="number"
                        min="0"
                        className="border px-2 py-1 w-20 mr-2"
                        value={editingStock[product.id] ?? product.stock}
                        onChange={e => handleStockChange(product.id, e.target.value)}
                        disabled={updating[product.id]}
                      />
                      <button
                        className="bg-gray-600 text-white px-2 py-1 rounded"
                        onClick={() => handleUpdateStock(product.id)}
                        disabled={updating[product.id] || Number(editingStock[product.id]) === product.stock}
                      >
                        {updating[product.id] ? 'Updating...' : 'Update Stok'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" value={form.name} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" placeholder="Nama Produk" required />
                <input name="price" type="number" value={form.price} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" placeholder="Harga" required />
                <input name="stock" type="number" value={form.stock} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" placeholder="Stok" required />
                <select name="categoryId" value={form.categoryId} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select name="subcategory" value={form.subcategory} onChange={handleFormChange} className="w-full border px-3 py-2 rounded">
                  <option value="">Pilih Subkategori</option>
                  <option value="pakaian">Pakaian</option>
                  <option value="sepatu">Sepatu</option>
                  <option value="aksesoris">Aksesoris</option>
                  <option value="tas">Tas</option>
                  <option value="perhiasan">Perhiasan</option>
                </select>
                <input name="brand" value={form.brand} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" placeholder="Brand" />
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" placeholder="Deskripsi" />
                <input name="images" type="file" multiple accept="image/*" onChange={handleFormChange} className="w-full" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={saving}>{saving ? 'Menyimpan...' : (editId ? 'Update' : 'Tambah')}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts; 