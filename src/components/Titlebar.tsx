import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const DraggableView = View as any;
const DraggableText = Text as any;

// Simple check if we're running inside Tauri
const isTauri = () => {
  return Platform.OS === 'web' && typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

export function Titlebar() {
  const [maximized, setMaximized] = useState(false);
  const [tauriWindow, setTauriWindow] = useState<any>(null);

  useEffect(() => {
    if (isTauri()) {
      // Dynamic import to avoid errors on pure web/mobile
      import('@tauri-apps/api/window').then((module) => {
        const { getCurrentWindow } = module;
        const appWindow = getCurrentWindow();
        setTauriWindow(appWindow);

        // Check initial maximize state
        appWindow.isMaximized().then(setMaximized);

        // Listen for resize events to toggle maximize icon
        appWindow.onResized(() => {
          appWindow.isMaximized().then(setMaximized);
        });
      }).catch(err => console.warn('Failed to load Tauri window API', err));
    }
  }, []);

  if (!isTauri()) {
    return null;
  }

  return (
    <View style={styles.titlebarContainer}>
      <style>{`
        /* Native desktop global styles */
        body {
          user-select: none;
          -webkit-user-select: none;
          cursor: default;
          overflow: hidden; /* prevent body scrolling */
        }
        /* Hide web scrollbars globally */
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          background: transparent;
        }
        /* Interactive elements should have pointers */
        a, button, [role="button"] {
          cursor: pointer;
        }
      `}</style>
      <DraggableView 
        style={[styles.dragRegion, isMac && { paddingLeft: 70 }]} 
        dataSet={{ tauriDragRegion: true }}
      >
        <DraggableText 
          style={styles.titleText}
          dataSet={{ tauriDragRegion: true }}
        >
          TaalSwipe
        </DraggableText>
      </DraggableView>
      
      {!isMac && (
        <View style={styles.windowControls}>
          <TouchableOpacity onPress={() => tauriWindow?.minimize()} style={styles.controlButton}>
            <Ionicons name="remove" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => tauriWindow?.toggleMaximize()} style={styles.controlButton}>
            <Ionicons name={maximized ? "copy-outline" : "stop-outline"} size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => tauriWindow?.close()} style={[styles.controlButton, styles.closeButton]}>
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titlebarContainer: {
    height: 38,
    backgroundColor: '#050814', // Very dark background
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dragRegion: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 16,
    // Add web specific style for grabbing cursor
    //@ts-ignore
    cursor: 'default',
  },
  titleText: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  windowControls: {
    flexDirection: 'row',
    height: '100%',
  },
  controlButton: {
    width: 46,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    // Hover effect typically implemented with CSS on web, but this is simple enough
  },
});
