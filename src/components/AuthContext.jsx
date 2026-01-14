import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

import { SUPER_ADMIN_EMAILS } from '../constants';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const checkAdminStatus = async (currentUser) => {
        if (!currentUser?.email) {
            setIsAdmin(false);
            setIsSuperAdmin(false);
            return;
        }

        const email = currentUser.email.toLowerCase();
        const isSuper = SUPER_ADMIN_EMAILS.includes(email);
        setIsSuperAdmin(isSuper);

        // If super admin, no need to check admins table
        if (isSuper) {
            setIsAdmin(true);
            return;
        }

        try {
            // Check if user is in admins table with timeout
            const { data, error } = await supabase
                .from('admins')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (error) {
                console.error('Admin query error:', error);
                setIsAdmin(false);
                return;
            }

            setIsAdmin(!!data);
        } catch (error) {
            // Network error or other issue - don't block the app
            console.error('Admin check failed:', error);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Session error:', error);
                }
                setSession(session);
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    await checkAdminStatus(currentUser);
                }
            } catch (err) {
                console.error('Failed to get session:', err);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await checkAdminStatus(currentUser);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: (data, options) => supabase.auth.signUp(data, options),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://callbook.hamradio.my/update-password',
        }),
        updatePassword: (password) => supabase.auth.updateUser({ password }),
        user,
        session,
        loading,
        isAdmin,
        isSuperAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

