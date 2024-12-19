import React from 'react'; // Import React to ensure it is in scope for JSX
import { createClient } from '@supabase/supabase-js';
import secrets from '../secrets.development';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Initialize Supabase client
export const supabase = createClient(secrets.supabaseUrl, secrets.supabaseKey);

const SupabaseClientApp = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    providers={['google', 'facebook', 'twitter']}
  />
);

export default SupabaseClientApp;
