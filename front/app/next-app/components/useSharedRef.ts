// useSharedRef.js
import { useRef } from "react";

export const useSharedRef = () => {
  const ref = useRef(null);
  return ref;
};
