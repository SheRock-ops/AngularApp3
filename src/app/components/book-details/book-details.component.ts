
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {

  // SIGNAL: Stores the selected book.
  book = signal<Book | null>(null);

  // SIGNAL: Tracks loading state.
  isLoading = signal<boolean>(true);

  // SIGNAL: Stores error messages.
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    public bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadBook(id);
    } else {
      this.errorMessage.set('Invalid book ID.');
      this.isLoading.set(false);
    }
  }

  // READ: Retrieve a single book from JSON Server.
  loadBook(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book.set(data);
        this.bookService.selectBook(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load book details.');
        this.isLoading.set(false);
      }
    });
  }

  // SIGNAL: Add or remove a book from favorites.
  toggleFavorite(id: string): void {
    this.bookService.toggleFavorite(id);
  }

}

