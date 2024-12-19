chrome.runtime.onInstalled.addListener((object) => {
  const externalUrl = chrome.runtime.getURL('install.html'); // Serve your app's HTML file.

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, (tab) => {
      console.log('React app opened in a new tab:', tab);
    });
  }
});
