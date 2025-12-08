const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client for Verification
// We use the ANON key here because we just want to verify the User's JWT.
// For admin tasks, we would need the Service Role Key.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth Error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Exception:', err);
    res.status(500).json({ error: 'Internal Server Error during Auth' });
  }
};

module.exports = authenticateUser;
