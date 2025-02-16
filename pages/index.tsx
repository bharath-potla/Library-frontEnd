"use client"; 
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  description: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");

  useEffect(() => {
    api.get("/books")
      .then(response => setBooks(response.data as Book[])) 
      .catch(error => console.error("Error fetching books:", error));
  }, []);

  const handleSearch = () => {
    api.get("/books/search", {
      params: { title: searchTitle || undefined, author: searchAuthor || undefined }
    })
    .then(response => setBooks(response.data as Book[]))
    .catch(error => {
      console.error("Error searching books:", error);
  
     
      if (error.response) {
        if (error.response.status === 404 || error.response.status === 500) {
          alert("No matching books found.");
        } 
      } 
    });
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Library Books</h1>
      <div className="mb-4 flex gap-2">
        <input 
          type="text" 
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="border p-2 rounded w-full"
        />
        <input 
          type="text" 
          placeholder="Search by author" 
          value={searchAuthor} 
          onChange={(e) => setSearchAuthor(e.target.value)} 
          className="border p-2 rounded w-full"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map(book => (
          <li key={book.id} className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">by {book.author} ({book.publicationYear})</p>
            <Link href={`/books/${book.id}`} className="text-blue-500">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  
}
