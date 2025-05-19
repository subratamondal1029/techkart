import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const DataList = ({ categories = [], id = "category-list", limit = 5 }) => {
  const { watch } = useFormContext();
  const category = watch("category");
  const [filteredCategories, setFilteredCategories] = useState(
    categories.slice(0, limit)
  );

  useEffect(() => {
    if (category === "") {
      setFilteredCategories(categories.slice(0, limit));
    } else {
      setFilteredCategories(
        categories
          .filter((c) => c.toLowerCase()?.includes(category?.toLowerCase()))
          .slice(0, limit)
      );
    }
  }, [category]);

  return (
    <datalist id={id}>
      {filteredCategories.map((c) => (
        <option key={c} value={c} />
      ))}
    </datalist>
  );
};

export default DataList;
