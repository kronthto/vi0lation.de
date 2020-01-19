var notificationPushAllowOverride = [
  'badge',
  'body',
  'icon',
  'tag',
  'image',
  'lang'
];

self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const sendNotification = data => {
    let title = 'CR Event'; // TODO: Dynamic

    let pushoptions = {
      body: data.text,
      icon: 'img/logo.png',
      badge: 'img/icon.png',
      data
    };
    notificationPushAllowOverride.forEach(function(prop) {
      if (typeof data[prop] !== 'undefined') {
        pushoptions[prop] = data[prop];
      }
    });
    if (typeof data.title !== 'undefined') {
      title = data.title;
    }

    return self.registration.showNotification(title, pushoptions);
  };

  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      data = { text: event.data.text() };
    }
    event.waitUntil(sendNotification(data));
  } else {
    event.waitUntil(sendNotification({ text: 'no details (weird error)' })); // We always need to show a notif on push, so display something to be safe
  }
});
