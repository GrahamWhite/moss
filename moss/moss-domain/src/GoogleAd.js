import { useEffect, useRef } from "react";

const GoogleAd = ({ adSlot }) => {
  const adRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current.offsetWidth > 0) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }, 1000); // Give DOM more time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto my-6" style={{ width: '300px', height: '250px' }}>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{
          display: 'inline-block',
          width: '300px',
          height: '250px',
        }}
        data-ad-client="ca-pub-9710899921368802"
        data-ad-slot={adSlot}
        data-ad-format="rectangle"
      />
    </div>
  );
};

export default GoogleAd;
