import { useState, useEffect } from 'react';

const styles = {
  container: {
    // position: 'fixed',
    // top: 0,
    // right: 0,
    // bottom: 0,
    // left: 0,
    // display: 'flex',
    // flexDirection: 'column',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    minHeight: '100dvh',
  }
};

export const Layout = ({ children }) => {
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
      className={`${isStandalone ? 'standalone' : ''} ${orientation}`}
    >
      {/* <div style={{ height: '100%', overflowY: 'auto' }}> */}
      {children}
      {/* </div> */}
    </div>
  );
};
