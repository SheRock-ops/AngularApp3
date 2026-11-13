
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  // URL of the simulated JSON Server backend.
  private readonly apiUrl = 'http://localhost:3000/books';

  // Signal stores the currently selected book.
  selectedBook = signal<Book | null>(null);

  // Signal stores the IDs of favorite books.
  favorites = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  // READ: Retrieve all books from the backend.
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // READ: Retrieve one book using its ID.
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // CREATE: Add a new book to the database.
  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // UPDATE: Save changes to an existing book.
  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(
      `${this.apiUrl}/${book.id}`,
      book
    );
  }

  // DELETE: Remove a book from the database.
  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // SIGNAL: Update the currently selected book.
  selectBook(book: Book | null): void {
    this.selectedBook.set(book);
  }

  // SIGNAL: Add or remove a book from favorites.
  toggleFavorite(id: string): void {
    this.favorites.update(current =>
      current.includes(id)
        ? current.filter(bookId => bookId !== id)
        : [...current, id]
    );
  }

  // Check whether a book is currently a favorite.
  isFavorite(id: string): boolean {
    return this.favorites().includes(id);
  }
}
