if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  );
  if (workbox) {
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();
    console.log("Workbox is loaded");

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    workbox.routing.registerNavigationRoute(
      // Assuming '/single-page-app.html' has been precached,
      // look up its corresponding cache key.
      workbox.precaching.getCacheKeyForURL("/index.html"),
      {
        blacklist: [
          new RegExp("/admin/"),
          new RegExp("/signin/"),
          new RegExp("/dashboard/")
        ]
      }
    );

    workbox.routing.registerRoute(
      new RegExp(/\.(?:png|gif|jpg|jpeg)$/),
      new workbox.strategies.CacheFirst({
        cacheName: "images",
      })
    );

    workbox.routing.registerRoute(
      new RegExp("https://fonts.googleapis.com/"),
      new workbox.strategies.CacheFirst({
        cacheName: "font",
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
          })
        ]
      })
    );

  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}
