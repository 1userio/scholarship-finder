## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. In Authentication settings, enable email/password sign-up and keep email confirmation enabled for public launch.
4. Add your deployed site URL and auth redirect URL (for example, `https://your-domain.com/auth.html`) to the Auth URL settings.
5. Copy `js/config.example.js` to `js/config.js` and put only the project URL and publishable/anon browser key there. Never put a service-role key in the browser.

The frontend uses Supabase Auth for sign-up/sign-in and the three tables above for profiles, saved scholarships, and private notes. Row Level Security ensures users can only access their own rows.
