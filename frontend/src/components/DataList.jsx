import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const DataList = ({
  list = [],
  id = "list",
  limit = 5,
  valueState,
  inputName,
}) => {
  const formContext = useFormContext();
  let value = "";
  if (formContext && inputName) {
    value = formContext.watch(inputName);
  } else if (valueState) {
    value = valueState;
  }

  const [filteredList, setFilteredList] = useState(list.slice(0, limit));

  useEffect(() => {
    if (value === "") {
      setFilteredList(list.slice(0, limit));
    } else {
      setFilteredList(
        list
          .filter((c) => c.toLowerCase()?.includes(value?.toLowerCase()))
          .slice(0, limit)
      );
    }
  }, [value]);

  return (
    <datalist id={id}>
      {filteredList.map((c) => (
        <option key={c} value={c} />
      ))}
    </datalist>
  );
};

export default DataList;
