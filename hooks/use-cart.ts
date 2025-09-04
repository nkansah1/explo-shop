"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./use-auth"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  id: string
  order_number: string
  items: CartItem[]
  total: number
  status: string
  created_at: string
}

interface CartState {
  items: CartItem[]
  orders: Order[]
  isLoading: boolean
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
  loadOrders: () => Promise<void>
  createOrder: (orderData: any) => Promise<string | null>
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      isLoading: false,

      addItem: async (item) => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        // For unauthenticated users, use local storage only
        if (!user) {
          const currentItems = get().items
          const existingItem = currentItems.find(i => i.product_id === item.product_id)
          
          if (existingItem) {
            // Update existing item quantity
            set({
              items: currentItems.map(i => 
                i.product_id === item.product_id 
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              )
            })
          } else {
            // Add new item
            const newItem: CartItem = {
              id: crypto.randomUUID(),
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity || 1,
            }
            set({ items: [...currentItems, newItem] })
          }
          return
        }

        set({ isLoading: true })

        try {
          // For authenticated users, try database first, fallback to local
          const { data: existingItem } = await supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", user.id)
            .eq("product_id", item.product_id)
            .single()

          if (existingItem) {
            // Update existing item quantity
            const { error } = await supabase
              .from("cart_items")
              .update({ quantity: existingItem.quantity + (item.quantity || 1) })
              .eq("id", existingItem.id)

            if (error) {
              console.warn("Failed to update database, using local cart:", error)
              // Fallback to local cart
              const currentItems = get().items
              const existingLocalItem = currentItems.find(i => i.product_id === item.product_id)
              
              if (existingLocalItem) {
                set({
                  items: currentItems.map(i => 
                    i.product_id === item.product_id 
                      ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                      : i
                  )
                })
              } else {
                const newItem: CartItem = {
                  id: crypto.randomUUID(),
                  product_id: item.product_id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity || 1,
                }
                set({ items: [...currentItems, newItem] })
              }
              return
            }
          } else {
            // Insert new item
            const { error } = await supabase.from("cart_items").insert({
              user_id: user.id,
              product_id: item.product_id,
              quantity: item.quantity || 1,
            })

            if (error) {
              console.warn("Failed to insert to database, using local cart:", error)
              // Fallback to local cart
              const currentItems = get().items
              const existingLocalItem = currentItems.find(i => i.product_id === item.product_id)
              
              if (existingLocalItem) {
                set({
                  items: currentItems.map(i => 
                    i.product_id === item.product_id 
                      ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                      : i
                  )
                })
              } else {
                const newItem: CartItem = {
                  id: crypto.randomUUID(),
                  product_id: item.product_id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity || 1,
                }
                set({ items: [...currentItems, newItem] })
              }
              return
            }
          }

          // Reload cart from database
          await get().loadCart()
        } catch (error) {
          console.error("Error adding item to cart, falling back to local:", error)
          // Fallback to local cart
          const currentItems = get().items
          const existingLocalItem = currentItems.find(i => i.product_id === item.product_id)
          
          if (existingLocalItem) {
            set({
              items: currentItems.map(i => 
                i.product_id === item.product_id 
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              )
            })
          } else {
            const newItem: CartItem = {
              id: crypto.randomUUID(),
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity || 1,
            }
            set({ items: [...currentItems, newItem] })
          }
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId) => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        // For unauthenticated users, use local storage only
        if (!user) {
          set({
            items: get().items.filter((item) => item.product_id !== productId),
          })
          return
        }

        set({ isLoading: true })

        try {
          const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId)

          if (error) {
            console.warn("Failed to remove from database, using local cart:", error)
          }

          // Update local state regardless
          set({
            items: get().items.filter((item) => item.product_id !== productId),
          })
        } catch (error) {
          console.error("Error removing item from cart:", error)
          // Still remove from local state
          set({
            items: get().items.filter((item) => item.product_id !== productId),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        const supabase = createClient()
        const { user } = useAuth.getState()

        // For unauthenticated users, use local storage only
        if (!user) {
          set({
            items: get().items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          })
          return
        }

        set({ isLoading: true })

        try {
          const { error } = await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", user.id)
            .eq("product_id", productId)

          if (error) {
            console.warn("Failed to update database, using local cart:", error)
          }

          // Update local state regardless
          set({
            items: get().items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          })
        } catch (error) {
          console.error("Error updating item quantity:", error)
          // Still update local state
          set({
            items: get().items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        // Clear local cart first
        set({ items: [] })

        // If user is authenticated, also clear database
        if (user) {
          set({ isLoading: true })

          try {
            const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

            if (error) {
              console.warn("Failed to clear database cart:", error)
            }
          } catch (error) {
            console.error("Error clearing cart:", error)
          } finally {
            set({ isLoading: false })
          }
        }
      },

      loadCart: async () => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        if (!user) {
          set({ items: [] })
          return
        }

        set({ isLoading: true })

        try {
          const { data, error } = await supabase
            .from("cart_items")
            .select(`
              id,
              product_id,
              quantity,
              products (
                name,
                price,
                images
              )
            `)
            .eq("user_id", user.id)

          if (error) throw error

          const cartItems: CartItem[] =
            data?.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.products.name,
              price: item.products.price,
              image: item.products.images[0] || "/placeholder.svg",
              quantity: item.quantity,
            })) || []

          set({ items: cartItems })
        } catch (error) {
          console.error("Error loading cart:", error)
          set({ items: [] })
        } finally {
          set({ isLoading: false })
        }
      },

      loadOrders: async () => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        if (!user) {
          set({ orders: [] })
          return
        }

        set({ isLoading: true })

        try {
          const { data, error } = await supabase
            .from("orders")
            .select(`
              id,
              order_number,
              total,
              status,
              created_at,
              order_items (
                id,
                product_name,
                unit_price,
                quantity,
                product_id
              )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (error) throw error

          const orders: Order[] =
            data?.map((order: any) => ({
              id: order.id,
              order_number: order.order_number,
              total: order.total,
              status: order.status,
              created_at: order.created_at,
              items: order.order_items.map((item: any) => ({
                id: item.id,
                product_id: item.product_id,
                name: item.product_name,
                price: item.unit_price,
                quantity: item.quantity,
                image: "/placeholder.svg",
              })),
            })) || []

          set({ orders })
        } catch (error) {
          console.error("Error loading orders:", error)
          set({ orders: [] })
        } finally {
          set({ isLoading: false })
        }
      },

      createOrder: async (orderData) => {
        const supabase = createClient()
        const { user } = useAuth.getState()

        if (!user) return null

        set({ isLoading: true })

        try {
          // Create order
          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
              user_id: user.id,
              email: user.email,
              status: "pending",
              payment_status: "pending",
              subtotal: orderData.subtotal,
              tax_amount: orderData.tax_amount || 0,
              shipping_amount: orderData.shipping_amount || 0,
              total: orderData.total,
              billing_first_name: orderData.billing.firstName,
              billing_last_name: orderData.billing.lastName,
              billing_address_line_1: orderData.billing.address,
              billing_city: orderData.billing.city,
              billing_state: orderData.billing.state,
              billing_postal_code: orderData.billing.zipCode,
              billing_country: orderData.billing.country || "US",
              shipping_first_name: orderData.shipping.firstName,
              shipping_last_name: orderData.shipping.lastName,
              shipping_address_line_1: orderData.shipping.address,
              shipping_city: orderData.shipping.city,
              shipping_state: orderData.shipping.state,
              shipping_postal_code: orderData.shipping.zipCode,
              shipping_country: orderData.shipping.country || "US",
              payment_method: orderData.payment_method,
            })
            .select()
            .single()

          if (orderError) throw orderError

          // Create order items
          const cartItems = get().items
          const orderItems = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          }))

          const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

          if (itemsError) throw itemsError

          // Clear cart after successful order
          await get().clearCart()

          return order.id
        } catch (error) {
          console.error("Error creating order:", error)
          return null
        } finally {
          set({ isLoading: false })
        }
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
