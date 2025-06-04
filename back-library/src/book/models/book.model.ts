/**
 * Domain model for Book
 */
export class BookModel {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  publisher?: string;
  fileCover?: string;
  available: boolean = true;
  deleted: boolean = false;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<BookModel>) {
    Object.assign(this, data);
  }
}