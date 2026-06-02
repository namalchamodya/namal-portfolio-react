import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncProfile = async (sessionUser) => {
            if (!sessionUser) return;
            try {
                const fullName = sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || 'User';
                const avatarUrl = sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture || null;

                // Force synchronize User info to public.profiles table
                const { error } = await supabase.from('profiles').upsert({
                    id: sessionUser.id,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    email: sessionUser.email
                }, { onConflict: 'id' });

                if (error) console.error("Error auto-syncing profile:", error.message);

                // Fetch profile to check if the user is an admin
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                if (data && !fetchError) {
                    setProfile(data);
                    setIsAdmin(!!data.is_admin);
                } else {
                    // Fallback to non-admin profile if fetch fails or no profile exists yet
                    setProfile({
                        id: sessionUser.id,
                        full_name: fullName,
                        avatar_url: avatarUrl,
                        is_admin: false
                    });
                    setIsAdmin(false);
                }
            } catch (e) {
                console.error("Crash during syncProfile:", e);
                setIsAdmin(false);
            }
        };

        // Check active sessions and sets the user (non-blocking)
        supabase.auth.getSession().then(({ data: { session } }) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                syncProfile(sessionUser).catch(err => console.error("Session sync failed:", err));
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        // Listen for changes on auth state (log in, log out, etc. - non-blocking)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                syncProfile(sessionUser).catch(err => console.error("Auth state change sync failed:", err));
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
            setLoading(false);
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
        setProfile(null);
        setIsAdmin(false);
    };

    const value = {
        user,
        profile,
        isAdmin,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
