// @flow
import { useRef, useEffect } from "react";

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
// eslint-disable-next-line import/prefer-default-export
export function usePrevious<T>(value: T): T {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
