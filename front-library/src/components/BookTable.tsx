import { useState, useEffect } from 'react';
import BookModal from './BookModal';
import apiService from '../services/api.service';
import type { Book, BookPaginationParams } from '../services/api.service';

interface BookTableProps {
  onDeleteBook?: (id: number) => void;
  onSaveBook?: (book: Omit<Book, 'id'> & { id?: number }) => void;
}

const BookTable = ({ onDeleteBook, onSaveBook }: BookTableProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  
  const booksPerPage = 5;

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const skip = (currentPage - 1) * booksPerPage;
      const sort1 = sortDirection === 'asc' ? sortField : `-${sortField}`;
      
      const params: BookPaginationParams = {
        skip,
        limit: booksPerPage,
        sort1
      };
      
      if (searchTerm) {
        params.query = searchTerm;
      }
      
      const response = await apiService.getBooks(params);
      console.log('Fetched books:', response);
      setBooks(response?.items || []);
      setTotalBooks(response?.total || 0);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortField, sortDirection]);

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteBook(id);
      fetchBooks();
      if (onDeleteBook) {
        onDeleteBook(id);
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
      setError('Failed to delete book. Please try again.');
    }
  };

  const handleSave = async (bookData: Omit<Book, 'id'> & { id?: number }) => {
    try {
      if (bookData.id) {
        await apiService.updateBook(bookData.id, bookData);
      } else {
        await apiService.createBook(bookData);
      }
      fetchBooks();
      if (onSaveBook) {
        onSaveBook(bookData);
      }
    } catch (err) {
      console.error('Failed to save book:', err);
      setError('Failed to save book. Please try again.');
    }
    setIsModalOpen(false);
    setEditingBook(undefined);
  };

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  return (
    <div>
      <h2>Book Collection</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => {
          setEditingBook(undefined);
          setIsModalOpen(true);
        }}>Add New Book</button>
      </div>
      <table>
        <thead>
          <tr>
            <th data-column="title" onClick={() => handleSort('title')}>
              Title {sortField === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th data-column="author" onClick={() => handleSort('author')}>
              Author {sortField === 'author' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th data-column="publisher" onClick={() => handleSort('publisher')}>
              Publisher {sortField === 'publisher' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th data-column="available" onClick={() => handleSort('available')}>
              Available {sortField === 'available' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th data-column="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5}>Loading books...</td>
            </tr>
          ) : books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td data-column="title">{book.title}</td>
                <td data-column="author">{book.author}</td>
                <td data-column="publisher">{book.publisher}</td>
                <td data-column="available">{book.available ? 'Yes' : 'No'}</td>
                <td data-column="actions">
                  <button onClick={() => {
                    setEditingBook(book);
                    setIsModalOpen(true);
                  }}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No books found</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {totalBooks > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1 || loading}
          >
            First
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1 || loading}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages || loading}
          >
            Last
          </button>
        </div>
      )}

      <BookModal
        isOpen={isModalOpen}
        book={editingBook}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(undefined);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default BookTable;