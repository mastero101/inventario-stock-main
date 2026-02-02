
import { Product, Movement } from '../types';

const API_URL = "http://localhost:3001/api";

export const db = {
  // --- PRODUCTOS ---
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error("Error fetching products");
      return await response.json();
    } catch (error) {
      console.error("Error en getProducts:", error);
      // Fallback a localStorage por si acaso
      const localData = localStorage.getItem('chubut_products');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async saveProduct(product: Product): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error("Error saving product");
    } catch (error) {
      console.error("Error en saveProduct:", error);
      // Guardar local para no perder datos si el backend falla
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id === product.id);
      if (index >= 0) products[index] = product;
      else products.push(product);
      localStorage.setItem('chubut_products', JSON.stringify(products));
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Error deleting product");
    } catch (error) {
      console.error("Error en deleteProduct:", error);
    }
  },

  // --- MOVIMIENTOS ---
  async getMovements(): Promise<Movement[]> {
    try {
      const response = await fetch(`${API_URL}/movements`);
      if (!response.ok) throw new Error("Error fetching movements");
      return await response.json();
    } catch (error) {
      console.error("Error en getMovements:", error);
      const data = localStorage.getItem('chubut_movements');
      return data ? JSON.parse(data) : [];
    }
  },

  async addMovement(movementData: Omit<Movement, 'id' | 'fecha'>): Promise<void> {
    const newMovement = {
      ...movementData,
      id: Math.random().toString(36).substr(2, 9)
    };

    try {
      const response = await fetch(`${API_URL}/movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovement)
      });
      if (!response.ok) throw new Error("Error adding movement");
    } catch (error) {
      console.error("Error en addMovement:", error);
      throw error;
    }
  },

  async getStats() {
    const products = await this.getProducts();
    const movements = await this.getMovements();
    const today = new Date().toDateString();

    return {
      totalProducts: products.length,
      lowStock: products.filter(p => p.stockActual <= p.stockMinimo).length,
      movementsToday: movements.filter(m => new Date(m.fecha).toDateString() === today).length,
      outOfStock: products.filter(p => p.stockActual <= 0).length,
      recentMovements: movements.slice(0, 5)
    };
  }
};
