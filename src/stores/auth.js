import axios from "axios"
import { defineStore } from "pinia"

export const useAuthStore = defineStore('authStore', {

    state: () => {
        return {
            user: null,
            errors: {}
        }
    },
    actions: {

        async getUser() {
            try {
                const token = sessionStorage.getItem("token") || localStorage.getItem("token")
                if (token) {

                    const res = await axios.get("/api/user", {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    })
                    this.user = res.data
                }
                else {
                    this.user = null
                }
            } catch (error) {
                console.error("Error fetching user:", error)
                this.user = null
            }
        },

        async authenticate(formData) {
            try {
                const payload = { ...formData }
                const res = await axios.post(`/api/login`, payload)

                const token = res.data.token

                this.errors = {}
                if (formData.remember) {
                    localStorage.setItem('token', token)
                } else {
                    sessionStorage.setItem('token', token)
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                this.user = res.data.user

                this.router.push({ name: 'dashboard' })


            } catch (error) {
                console.log(error.response.data.errors)
                this.errors = Object.keys(error.response.data.errors).reduce((acc, field) => {
                    acc[field] = error.response.data.errors[field][0]
                    return acc
                }, {})
                throw new Error('Login failed')
            }
        },

        async logout() {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('authToken')

                const res = await axios.post('/api/logout', {}, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })

                if (res.status === 200) {
                    localStorage.removeItem("token")
                    sessionStorage.removeItem("token")
                    this.user = null
                    this.errors = {}
                    this.router.push({ name: "login" })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}) 