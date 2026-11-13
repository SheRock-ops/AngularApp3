
import { Routes } from '@angular/router';

import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

// Application routes for BookVerse.
export const routes: Routes = [

  // Redirect homepage to the book collection.
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },

  // READ: Display all books.
  {
    path: 'books',
    component: BookListComponent
  },

  // CREATE: Display the Add New Book form.
  {
    path: 'books/new',
    component: BookFormComponent
  },

  // UPDATE: Edit an existing book.
  {
    path: 'books/edit/:id',
    component: BookFormComponent
  },

  // READ: Display details of a selected book.
  {
    path: 'books/:id',
    component: BookDetailsComponent
  },

  // Redirect unknown URLs to the book collection.
  {
    path: '**',
    redirectTo: 'books'
  }

];
