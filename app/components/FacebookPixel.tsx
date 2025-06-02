import {useEffect} from 'react';

function FacebookPixel() {
  useEffect(() => {
    // Initialize Facebook Pixel
    // eslint-disable-next-line no-unused-expressions
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    // eslint-disable-next-line no-undef
    fbq('init', '631720560648719'); // Replace 'YOUR_PIXEL_ID' with your actual Pixel ID
  }, []);

  return null;
}

export default FacebookPixel;
