"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"

interface AuthUser {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; needsVerification?: boolean }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUserRole: (role: "customer" | "admin") => void
  resendVerificationEmail: (email: string) => Promise<boolean>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            console.error("Login error:", error.message)
            console.error("Full error object:", error)
            set({ isLoading: false })
            return false
          }

          if (data.user && data.session) {
            // Get user profile from our users table
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.user.id)
              .single()

            if (profileError) {
              console.warn("Profile fetch error:", profileError)
              // Create a basic auth user even if profile fetch fails
            }

            const authUser: AuthUser = {
              id: data.user.id,
              email: data.user.email!,
              name: profile?.full_name || data.user.email!.split("@")[0],
              role: profile?.role || "customer",
            }

            set({ user: authUser, isLoading: false })
            return true
          }
        } catch (error) {
          console.error("Login error:", error)
        }

        set({ isLoading: false })
        return false
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : `https://explo-shop.vercel.app/auth/callback`,
              data: {
                full_name: name,
              },
            },
          })

          if (error) {
            console.error("Registration error:", error.message)
            set({ isLoading: false })
            return { success: false }
          }

          if (data.user) {
            // Check if email confirmation is required
            if (!data.user.email_confirmed_at && !data.session) {
              console.log("Email verification required")
              set({ isLoading: false })
              return { success: true, needsVerification: true }
            }

            // If user is confirmed, set the user data
            if (data.session && data.user.email_confirmed_at) {
              const authUser: AuthUser = {
                id: data.user.id,
                email: data.user.email!,
                name: name,
                role: "customer",
              }
              set({ user: authUser, isLoading: false })
              return { success: true, needsVerification: false }
            } else {
              set({ isLoading: false })
              return { success: true, needsVerification: true }
            }
          }
        } catch (error: any) {
          console.error("Registration error:", error)
          
          // Handle specific Supabase errors
          if (error?.message?.includes("Email not confirmed")) {
            console.error("Email confirmation required")
            return { success: true, needsVerification: true }
          } else if (error?.message?.includes("Invalid email")) {
            console.error("Invalid email format")
          } else if (error?.message?.includes("Password should be at least")) {
            console.error("Password too weak")
          }
        }

        set({ isLoading: false })
        return { success: false }
      },

      logout: async () => {
        try {
          console.log('Starting logout process...')
          const supabase = createClient()
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            console.error('Logout error:', error)
            // Still clear user state even if signOut fails
          } else {
            console.log('Logout successful')
          }
          
          set({ user: null })
        } catch (error) {
          console.error('Logout exception:', error)
          // Always clear user state on logout attempt
          set({ user: null })
        }
      },

      checkAuth: async () => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            // Get user profile from our users table
            const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

            const authUser: AuthUser = {
              id: user.id,
              email: user.email!,
              name: profile?.full_name || user.email!.split("@")[0],
              role: profile?.role || "customer",
            }

            set({ user: authUser, isLoading: false })
          } else {
            set({ user: null, isLoading: false })
          }
        } catch (error) {
          console.error("Auth check error:", error)
          set({ user: null, isLoading: false })
        }
      },

      updateUserRole: (role: "customer" | "admin") => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, role } })
        }
      },

      resendVerificationEmail: async (email: string) => {
        const supabase = createClient()
        
        try {
          const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
            options: {
              emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : `https://explo-shop.vercel.app/auth/callback`,
            },
          })

          if (error) {
            console.error("Resend verification error:", error.message)
            return false
          }

          return true
        } catch (error) {
          console.error("Resend verification error:", error)
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
