import { useState, useMemo } from 'react';
import BookModal from './BookModal';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  available: boolean;
}

interface BookTableProps {
  books: Book[];
  onDeleteBook?: (id: number) => void;
  onEditBook?: (book: Book) => void;
  onSaveBook?: (book: Omit<Book, 'id'> & { id?: number }) => void;
}

const BookTable = ({ books, onDeleteBook, onEditBook, onSaveBook }: BookTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'boolean') {
          return sortDirection === 'asc' 
            ? (aValue === bValue ? 0 : aValue ? -1 : 1)
            : (aValue === bValue ? 0 : aValue ? 1 : -1);
        }
        
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [books, searchTerm, sortField, sortDirection]);

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div>
      <h2>Book Collection</h2>
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
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
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
                  <button onClick={() => onDeleteBook?.(book.id)}>Delete</button>
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
      
      {filteredBooks.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            First
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
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
        onSave={(bookData) => {
          setIsModalOpen(false);
          if (onSaveBook) {
            onSaveBook(bookData);
          }
          setEditingBook(undefined);
        }}
      />
    </div>
  );
};

export default BookTable;