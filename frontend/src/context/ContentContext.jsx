import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getContent } from "../lib/api";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const refresh = useCallback(() => {
    setStatus("loading");
    return getContent()
      .then((data) => {
        setContent(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, status, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
