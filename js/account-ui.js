(() => {
  const container = document.getElementById('accountActions');

  if (!container) return;

  const cfg = window.SCHOLARSHIP_FINDER_CONFIG || {};

  const ready =
    window.supabase &&
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes('PASTE_');

  const client = ready
  ? (
      window.__SF_SUPABASE__ ||
      (window.__SF_SUPABASE__ = window.supabase.createClient(
        cfg.SUPABASE_URL,
        cfg.SUPABASE_ANON_KEY
      ))
    )
  : null;

  function clear() {
    container.innerHTML = '';
  }

  function createLink(text, href, extraClass = '') {
    const link = document.createElement('a');
    link.className = `nav-link ${extraClass}`.trim();
    link.href = href;
    link.textContent = text;
    return link;
  }

  function renderSignedOut() {
    clear();

    container.appendChild(
      createLink('Sign in', 'auth.html?mode=login')
    );

    container.appendChild(
      createLink('Create account', 'auth.html?mode=signup', 'account-create')
    );
  }

  function renderSignedIn(user) {
    clear();

    const name =
      user?.user_metadata?.display_name?.trim() ||
      user?.email ||
      'Account';

    const status = document.createElement('span');
    status.className = 'account-status';
    status.textContent = `✓ Signed in as ${name}`;

    const logout = document.createElement('button');
    logout.className = 'nav-link account-logout';
    logout.type = 'button';
    logout.textContent = 'Log out';

    logout.addEventListener('click', async () => {
      logout.disabled = true;
      logout.textContent = 'Logging out...';

      if (client) {
        const { error } = await client.auth.signOut();

        if (error) {
          console.error('Logout failed:', error);
          logout.disabled = false;
          logout.textContent = 'Log out';
          return;
        }
      }

      localStorage.setItem('sf-mode', 'guest');

      // Reload so every page resets its current user state too.
      location.reload();
    });

    container.appendChild(status);
    container.appendChild(logout);
  }

  async function update(user = null) {
    if (user) {
      renderSignedIn(user);
      return;
    }

    if (!client) {
      renderSignedOut();
      return;
    }

    const { data, error } = await client.auth.getUser();

    if (error || !data?.user) {
      renderSignedOut();
      return;
    }

    renderSignedIn(data.user);
  }

  // Initial state
  update();

  // Keep the UI synced with Supabase auth.
  if (client) {
    client.auth.onAuthStateChange((_event, session) => {
      update(session?.user || null);
    });
  }
})();