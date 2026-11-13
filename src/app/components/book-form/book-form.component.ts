
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {

  // Form fields.
  title = '';
  author = '';
  description = '';
  genre = '';
  year: number | null = null;

  // Track whether the form is adding or editing.
  isEditMode = false;
  bookId = '';

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.bookId = id;
      this.loadBook(id);
    }

  }

  // READ: Load the existing book for editing.
  loadBook(id: string): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.title = book.title;
        this.author = book.author;
        this.description = book.description;
        this.genre = book.genre;
        this.year = book.year;

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load book for editing.';
        this.isLoading = false;
      }
    });

  }

  // CREATE or UPDATE: Save the book.
  saveBook(): void {

    if (
      !this.title.trim() ||
      !this.author.trim() ||
      !this.description.trim() ||
      !this.genre.trim() ||
      this.year === null ||
      !Number.isInteger(this.year) ||
      this.year < 1
    ) {
      this.errorMessage = 'Please complete all fields correctly.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const bookData = {
      title: this.title.trim(),
      author: this.author.trim(),
      description: this.description.trim(),
      genre: this.genre.trim(),
      year: this.year
    };

    if (this.isEditMode) {

      // UPDATE: Save changes to an existing book.
      this.bookService.updateBook({
        id: this.bookId,
        ...bookData
      }).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/books', this.bookId]);
        },
        error: () => {
          this.errorMessage = 'Unable to update book.';
          this.isSaving = false;
        }
      });

    } else {

      // CREATE: Add a new book.
      this.bookService.addBook(bookData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/books']);
        },
        error: () => {
          this.errorMessage = 'Unable to add book.';
          this.isSaving = false;
        }
      });

    }

  }

}
