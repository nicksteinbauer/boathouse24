import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

function FacebookPixel(): null {
  useEffect(() => {
    // Initialize Facebook Pixel
    (function (f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Node | null) {
      if (f.fbq) return;
      n = f.fbq = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq?.('init', '631720560648719'); // Replace with your actual Pixel ID
    window.fbq?.('track', 'PageView');
  }, []);

  return null;
}

export default FacebookPixel;
