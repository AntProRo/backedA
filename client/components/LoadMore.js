import React, { useContext } from "react";
import { AuthContext } from "../context";

function LoadMore() {
  const state = useContext(AuthContext);
  const [page, setPage] = state.User.page;
  const [result] = state.User.result;

  return (
    <div className="load_more">
      {result < page * 6 ? (
        ""
      ) : (
        <button onClick={() => setPage(page + 1)}>Load more</button>
      )}
    </div>
  );
}

export default LoadMore;
