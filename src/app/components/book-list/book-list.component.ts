
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {

  // SIGNAL: Stores all books.
  books = signal<Book[]>([]);

  // SIGNAL: Tracks loading state.
  isLoading = signal<boolean>(true);

  // SIGNAL: Stores error messages.
  errorMessage = signal<string>('');

  // SIGNAL: Stores the search text.
  searchTerm = signal<string>('');

  // SIGNAL: Stores the selected genre.
  selectedGenre = signal<string>('All Genres');

  // COMPUTED SIGNAL: Available genres.
  genres = computed(() => [
    'All Genres',
    ...new Set(this.books().map(book => book.genre))
  ]);

  // COMPUTED SIGNAL: Filter books by search and genre.
  filteredBooks = computed(() => {

    const search = this.searchTerm().trim().toLowerCase();
    const genre = this.selectedGenre();

    return this.books().filter(book => {

      const matchesSearch =
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      const matchesGenre =
        genre === 'All Genres' ||
        book.genre === genre;

      return matchesSearch && matchesGenre;

    });

  });

  constructor(public bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  // READ: Retrieve all books.
  loadBooks(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Unable to load books. Please check JSON Server.'
        );
        this.isLoading.set(false);
      }
    });

  }

  // DELETE: Remove a book.
  deleteBook(id: string): void {

    if (confirm('Are you sure you want to delete this book?')) {

      this.bookService.deleteBook(id).subscribe({
        next: () => {

          this.books.update(current =>
            current.filter(book => book.id !== id)
          );

          if (this.bookService.isFavorite(id)) {
            this.bookService.toggleFavorite(id);
          }

        },
        error: () => {
          alert('Unable to delete this book.');
        }
      });

    }

  }

  // SIGNAL: Add or remove a favorite.
  toggleFavorite(id: string): void {
    this.bookService.toggleFavorite(id);
  }

  // FILTER: Reset search and genre selection.
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedGenre.set('All Genres');
  }

}
