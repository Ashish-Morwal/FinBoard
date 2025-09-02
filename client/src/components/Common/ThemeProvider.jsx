import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/dashboardSlice';

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('finboard-theme') || 'dark';
    if (savedTheme !== theme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, theme]);

  useEffect(() => {
    // Apply theme to document and save to localStorage
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('finboard-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
