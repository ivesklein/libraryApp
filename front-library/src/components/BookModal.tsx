import { useState, useEffect } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  available: boolean;
}

interface BookModalProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'> & { id?: number }) => void;
}

const BookModal = ({ book, isOpen, onClose, onSave }: BookModalProps) => {
  const [formData, setFormData] = useState<Omit<Book, 'id'> & { id?: number }>({
    title: '',
    author: '',
    publisher: '',
    available: true
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        publisher: '',
        available: true
      });
    }
  }, [book, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{book ? 'Edit Book' : 'Add New Book'}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              Available
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;