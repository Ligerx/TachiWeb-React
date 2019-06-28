// @flow
import { useState, useEffect, useRef } from "react";

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T): T {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// https://stackoverflow.com/questions/54625831/how-to-sync-props-to-state-using-react-hook-setstate
export function useDerivedStateFromProps<T>(props: T): [T, (state: T) => void] {
  const [state, setState] = useState(props);

  useEffect(() => {
    setState(props);
  }, [props]);

  return [state, setState];
}
