// @flow
import React, { useState, useEffect, type Node } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  children: Node,
  topThreshhold?: number,
  preventLoading?: boolean
};

const LazyLoad = ({
  children,
  topThreshhold = 0,
  preventLoading = false
}: Props) => {
  const [ref, inView] = useInView({
    margin: `${topThreshhold}px 0px 0px 0px`
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inView || preventLoading || loaded) return;

    setLoaded(true);
  }, [inView, preventLoading, loaded]);

  return (
    <>
      <div ref={ref} />
      {loaded ? children : null}
    </>
  );
};

export default LazyLoad;
