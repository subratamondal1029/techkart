import { Button, Pagination, TagInput, UpdateForm } from ".";
import { useState } from "react";
import delay from "../utils/delay";
import { FormProvider, useForm } from "react-hook-form";

const Test = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  return (
    <div className="min-h-screen w-full bg-gray-800 text-white">
      <p className="text-3xl text-center pt-4 mb-10">Test</p>
      <div className="flex items-center flex-col w-full">
        <Pagination page={page} setPage={setPage} totalPages={totalPages}>
          page: {page}
        </Pagination>
      </div>
    </div>
  );
};

export default Test;
