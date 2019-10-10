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

export function useThrottle(func: Function, wait?: number = 0): Function {
  const funcThrottled = useRef(throttle(func, wait)).current;

  useEffect(() => {
    return function cleanup() {
      funcThrottled.cancel();
    };
  }, [funcThrottled]);

  return funcThrottled;
}

// https://www.hooks.guide/rehooks/useComponentSize
// Slightly modified and including throttling
export function useComponentSize(ref) {
  const [componentSize, setComponentSize] = useState(getSize(ref.current));

  const wait = 100; // arbitrarily picking this wait time
  const setComponentSizeThrottled = useThrottle(
    size => setComponentSize(size),
    wait
  );

  useLayoutEffect(() => {
    function handleResize() {
      if (ref && ref.current) {
        setComponentSizeThrottled(getSize(ref.current));
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return function cleanup() {
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
  const setSizeThrottled = useThrottle(
    () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      }),
    wait
  );

  useEffect(() => {
    window.addEventListener("resize", setSizeThrottled);

    return function cleanup() {
      window.removeEventListener("resize", setSizeThrottled);
    };
  }, [setSizeThrottled]);

  return size;
}

type Rect = {
  left: number | void,
  top: number | void,
  right: number | void,
  bottom: number | void,
  x: number | void,
  y: number | void,
  width: number | void,
  height: number | void
};
// mostly based on useComponentSize()
/** Returns either the `.getBoundingClientRect()` or `{}` */
export function useBoundingClientRect(ref): Rect {
  const [componentRect, setComponentRect] = useState(
    ref.current ? ref.current.getBoundingClientRect() : {}
  );

  const wait = 100; // arbitrarily picking this wait time
  const setComponentRectThrottled = useThrottle(
    rect => setComponentRect(rect),
    wait
  );

  useLayoutEffect(() => {
    function handleResize() {
      if (ref && ref.current) {
        setComponentRectThrottled(ref.current.getBoundingClientRect());
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, setComponentRectThrottled]);

  return componentRect;
}
