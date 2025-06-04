import { useState } from 'react'
import LoginForm from './components/LoginForm'
import BookTable from './components/BookTable'

// Sample book data
const sampleBooks = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', publisher: 'J. B. Lippincott & Co.', available: true },
  { id: 2, title: '1984', author: 'George Orwell', publisher: 'Secker & Warburg', available: false },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publisher: 'Charles Scribner\'s Sons', available: true },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', publisher: 'T. Egerton', available: true },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', publisher: 'Little, Brown and Company', available: false },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', username, password);
    // Here you would typically make an API call to authenticate the user
    setIsLoggedIn(true);
  }

  return (
    <div>
      <header>
        <h1>Library App</h1>
      </header>
      <main>
        {!isLoggedIn ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <BookTable books={sampleBooks} />
        )}
      </main>
    </div>
  )
}

export default App