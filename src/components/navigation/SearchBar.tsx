import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full bg-crimson-darkest border border-crimson rounded-lg pl-10 pr-4 py-2 text-crimson-light placeholder-crimson-dark focus:outline-none focus:border-crimson"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-crimson-dark" />
    </form>
  );
};