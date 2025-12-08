import axios from 'axios';
import { supabase } from './supabase';

// Helper to determine URL based on environment
// For Android Emulator, use 10.0.2.2 to access host localhost.
// Getting Cap platform is generic, so we can use a simple toggle or env var.
// But for now, let's try to detect if we are on localhost vs build.
// Best approach: Use a VITE_API_URL env var or fallback.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add Auth Token
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;
