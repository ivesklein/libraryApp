import { useState, useEffect, useRef } from 'react';
import type { Book } from '../services/api.service';
import { processImage } from '../tools/format-img';

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
    description: '',
    available: true,
    fileCover: undefined
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        publisher: '',
        description: '',
        available: true,
        fileCover: undefined
      });
    }
  }, [book, isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Process the image with the specified dimensions
      const canvas = await processImage(file, { width: 90, height: 120 });
      
      // Convert the processed image to base64
      const base64Image = canvas.toDataURL('image/jpeg');
      
      // Update form data with the processed image
      setFormData(prev => ({
        ...prev,
        fileCover: base64Image
      }));
    } catch (error) {
      console.error('Error processing image:', error);
    }
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
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fileCover">Book Cover</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {formData.fileCover ? (
                <img 
                  src={formData.fileCover} 
                  alt="Book cover preview" 
                  style={{ width: '90px', height: '120px', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '90px', height: '120px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No Cover
                </div>
              )}
              <input
                type="file"
                id="fileCover"
                name="fileCover"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.fileCover ? 'Change Cover' : 'Upload Cover'}
              </button>
              {formData.fileCover && (
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, fileCover: undefined }))}
                >
                  Remove
                </button>
              )}
            </div>
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