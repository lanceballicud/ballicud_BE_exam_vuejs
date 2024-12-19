import axios from "axios"
import { defineStore } from "pinia"

export const useProductsStore = defineStore('productsSTore', {
    state: () => {
        return {
            errors: {},
            categories: [],
            predefinedCategories: [
                'Books',
                'Clothing',
                'Electronics',
                'Furniture',
                'Toys',
            ],
        }
    },
    actions: {

        async getProduct(id) {
            try {
                const res = await axios.get(`/api/products/${id}`)
                console.log(res.data)

                return res.data
            } catch (error) {
                console.log(res)
            }
        },

        async getAllProducts() {
            try {
                const res = await axios.get('/api/products')

                const products = res.data
                const categorySet = new Set()

                products.forEach(product => {
                    if (product.category_name) {
                        categorySet.add(product.category_name)
                    }
                })

                const allCategories = new Set([
                    ...this.predefinedCategories,
                    ...categorySet
                ])

                this.categories = [...allCategories]

                return products
            } catch (error) {
                console.log(error)
            }
        },

        async createProduct(formData) {
            const token = localStorage.getItem('token')

            try {
                const res = await axios.post('/api/products', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                this.router.push({ name: 'dashboard' })
            } catch (error) {
                console.log(error)
            }
        },
        async updateProduct(id, formData) {
            const token = localStorage.getItem('token')
            console.log(id)
            try {
                const res = await axios.put(`/api/products/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                this.router.push({ name: 'dashboard' })
            } catch (error) {
                console.log(error)
            }
        },
        async deleteProduct(id, products) {
            const token = localStorage.getItem('token')
            console.log(id)
            try {
                const res = await axios.delete(`/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const updatedProducts = products.filter((product) => product.id !== id)
                return updatedProducts
            } catch (error) {
                console.log(error)
            }
        },
    }
})