import secrets from 'secrets';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(secrets.supabaseUrl, secrets.supabaseKey);

// Listen for extension installation
chrome.runtime.onInstalled.addListener((object) => {
  const externalUrl = 'http://localhost:3001/welcome'; // Serve your app's HTML file.

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, (tab) => {
      console.log('React app opened in a new tab:', tab);
    });
  }
});

// chrome.cookies.get({ domain: 'localhost' }, (cookies) => {
//   console.log('Cookies:', cookies);
// });

// Trigger sign-in process when the browser action (or action in MV3) is clicked
chrome.action.onClicked.addListener(async () => {
  // Use chrome.action for Manifest V3
  const manifest = chrome.runtime.getManifest();
  const url = new URL('https://accounts.google.com/o/oauth2/auth');

  url.searchParams.set('client_id', manifest.oauth2.client_id);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set(
    'redirect_uri',
    `https://${chrome.runtime.id}.chromiumapp.org/`
  );
  url.searchParams.set('scope', manifest.oauth2.scopes.join(' '));

  // Launch OAuth flow using chrome.identity.launchWebAuthFlow
  chrome.identity.launchWebAuthFlow(
    {
      url: url.href,
      interactive: true,
    },
    async (redirectedTo) => {
      if (chrome.runtime.lastError) {
        console.error('Auth failed', chrome.runtime.lastError);
        return;
      }

      // Auth successful, extract the ID token from the URL
      const url = new URL(redirectedTo);
      const params = new URLSearchParams(url.hash);
      const idToken = params.get('id_token');

      if (!idToken) {
        console.error('No ID token found in the response');
        return;
      }

      // Use Supabase to sign in with the ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.error('Supabase sign-in failed', error.message);
      } else {
        console.log('Signed in with Supabase', data);

        // Redirect the user to the userForm page after successful authentication
        const userFormUrl = chrome.runtime.getURL('userForm.html');
        chrome.tabs.create({ url: userFormUrl }, (tab) => {
          console.log('Redirected to user form:', tab);
        });
      }
    }
  );
});
