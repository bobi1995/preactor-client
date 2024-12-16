import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("query") || "";
  const [term, setTerm] = useState(initialQuery);

  const handleSearch = useDebouncedCallback((inputTerm) => {
    const params = new URLSearchParams(location.search);
    params.set("page", "1");

    if (inputTerm) {
      params.set("query", inputTerm);
    } else {
      params.delete("query");
    }

    navigate(`${location.pathname}?${params.toString()}`);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTerm(inputValue);
    handleSearch(inputValue);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        value={term}
        onChange={handleInputChange}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
};

export default SearchBar;
