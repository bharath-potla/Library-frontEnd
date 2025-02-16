import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  description: string;
};

export default function BookDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get<Book>(`/books/${id}`)
        .then(response => setBook(response.data ))
        .catch(error => console.error("Error fetching book:", error));
    }
  }, [id]);

  const fetchAIInsights = () => {
    setLoading(true);
    Promise.resolve(api.get<{ choices: { message: { content: string } }[] }>(`/books/${id}/ai-insights`))
      .then(response => {const aiContent = response.data.choices?.[0]?.message?.content || "No insights available.";
      setInsights(aiContent)})
      .catch(error => console.error("Error fetching insights:", error))
      .finally(() => setLoading(false));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="text-gray-700">by {book.author} ({book.publicationYear})</p>
      <p className="text-gray-600">ISBN: {book.isbn}</p>
      <p className="mt-4">{book.description}</p>

      <button 
        onClick={fetchAIInsights} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Fetching..." : "Get AI Insights"}
      </button>

      {insights && (
        <p className="mt-4 p-4 bg-gray-100 rounded">{insights}</p>
      )}
    </div>
  );
}
