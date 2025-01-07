import { useState, useEffect } from 'react';

const styles = {
  container: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    minHeight: 'var(--full-height)',
  }
};

export const Layout = ({ className, children }) => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    const handleOrientation = () => {
      setTimeout(() => {
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;
        setOrientation(isPortrait ? 'portrait' : 'landscape');
      }, 100)
    };

    handleOrientation();
    window.addEventListener('orientationchange', handleOrientation);
    return () => window.removeEventListener('orientationchange', handleOrientation);
  }, []);

  return (
    <div
      style={{
        ...styles.container,
      }}
      className={`${isStandalone ? 'standalone' : ''} ${orientation} ${className || ''}`}
    >
      {/* <div style={{ height: '100%', overflowY: 'auto' }}> */}
      {children}
      {/* </div> */}
    </div>
  );
};
