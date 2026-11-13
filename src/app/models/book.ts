
/*
 * Book Model
 * Defines the structure of a book object.
 * Used by components and BookService.
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
}
