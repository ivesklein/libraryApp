import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BookTable from './components/BookTable'
import apiService from './services/api.service'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = apiService.isAuthenticated();
    if (isAuthenticated) {
      setIsLoggedIn(true);
    }
    
    // Listen for unauthorized event (401 responses)
    const handleUnauthorized = () => {
      setIsLoggedIn(false);
      setLoginError('Your session has expired. Please login again.');
    };
    
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);
  
  const handleLogin = async (username: string, password: string) => {
    try {
      setLoginError(null);
      await apiService.login({ username, password });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please check your credentials.');
    }
  }

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
  }

  return (
    <div>
      <header>
        <h1>Library App</h1>
        {isLoggedIn && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </header>
      <main>
        {!isLoggedIn ? (
          <LoginForm onSubmit={handleLogin} error={loginError} />
        ) : (
          <BookTable />
        )}
      </main>
    </div>
  )
}

export default App