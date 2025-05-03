import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    queries: [],
    cache: {
      // query: {
      //   page: [data]
      // }
    },
  },
  reducers: {
    addQuery: (state, action) => {
      const { query, page, data } = action.payload;

      if (!state.cache[query]) {
        state.cache[query] = {};
      }

      state.cache[query][page] = data;

      // Remove old query if not in bottom 10
      if (!state.queries.includes(query)) {
        if (state.queries.length >= 10) {
          const oldQuery = state.queries.shift();
          delete state.cache[oldQuery];
        }

        state.queries.push(query);
      }
    },
  },
});

export const { addQuery } = searchSlice.actions;
export default searchSlice.reducer;
