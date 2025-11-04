import { useAppContext } from '../contexts/AppContext';
import { AppID } from '../types'; // Import AppID type

export const useWindowManager = () => {
    const { windows, openWindow, closeWindow, toggleMinimize, focusWindow } = useAppContext();
    
    // Override openWindow to correctly type the props argument
    const openWindowWithProps = (id: AppID, title?: string, props?: Record<string, any>) => {
        openWindow(id, title, props);
    };

    return { windows, openWindow: openWindowWithProps, closeWindow, toggleMinimize, focusWindow };
};