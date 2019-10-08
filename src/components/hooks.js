// @flow
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import throttle from "lodash/throttle";

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

// https://www.hooks.guide/rehooks/useComponentSize
// Slightly modified and including throttling
export function useComponentSize(ref) {
  const [componentSize, setComponentSize] = useState(getSize(ref.current));

  const wait = 100; // arbitrarily picking this wait time
  const setComponentSizeThrottled = useRef(
    throttle(size => setComponentSize(size), wait)
  ).current;

  useLayoutEffect(() => {
    function handleResize() {
      if (ref && ref.current) {
        setComponentSizeThrottled(getSize(ref.current));
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      setComponentSizeThrottled.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, setComponentSizeThrottled]);

  return componentSize;
}
// Helper function
function getSize(el) {
  if (!el) return {};

  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  };
}

// mostly based on useComponentSize()
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const wait = 100; // arbitrarily picking this wait time
  const setSizeThrottled = useRef(
    throttle(
      () =>
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        }),
      wait
    )
  ).current;

  useEffect(() => {
    window.addEventListener("resize", setSizeThrottled);

    return () => {
      window.removeEventListener("resize", setSizeThrottled);
    };
  }, [setSizeThrottled]);

  return size;
}
