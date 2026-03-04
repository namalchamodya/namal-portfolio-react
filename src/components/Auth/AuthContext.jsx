import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncProfile = async (sessionUser) => {
            if (!sessionUser) return;
            const fullName = sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || 'User';
            const avatarUrl = sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture || null;

            // Force synchronize User info to public.profiles table
            const { error } = await supabase.from('profiles').upsert({
                id: sessionUser.id,
                full_name: fullName,
                avatar_url: avatarUrl
            }, { onConflict: 'id' });

            if (error) console.error("Error auto-syncing profile:", error.message);
        };

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            setLoading(false);
            if (sessionUser) syncProfile(sessionUser);
        });

        // Listen for changes on auth state (log in, log out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            setLoading(false);
            if (sessionUser) syncProfile(sessionUser);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) console.error("Error signing in with Google:", error.message);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error logging out:", error.message);
    };

    const value = {
        user,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
