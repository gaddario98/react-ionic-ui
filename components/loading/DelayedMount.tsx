import { useEffect, useState } from 'react';

interface Props {
  delay?: number;
  children: JSX.Element;
}

const DelayedMount = ({ delay = 250, children }: Props) => {
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowing(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  if (!isShowing) {
    return null;
  }

  return children ?? <></>;
};

export default DelayedMount;
