'use client';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { iTheme } from '@/lib/types';
import styles from './container.module.css';
import { ReactNode, FC } from 'react';

export interface iContainerProps {
  children?: ReactNode;
  padded?: boolean;
  fullWidth?: boolean;
  theme?: iTheme;
}

const Container: FC<iContainerProps> = ({
  children,
  padded = true,
  fullWidth = false,
  theme = iTheme.Light,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const classNames = [
    styles.container,
    padded && styles.padded,
    fullWidth && styles.fullWidth,
    theme === iTheme.Dark && styles.dark,
    isVisible && '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classNames} ref={elementRef}>
      {children}
    </section>
  );
};

export default Container;
