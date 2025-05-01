'use client';
import React from 'react';
import styles from './banner.module.css';
import LockUp from '@/components/Common/lockup';
import Actions from '@/components/Common/Actions';
import Container from '../Container';
import { iButtonProps } from '@/components/Common/button';
import { ImageProps } from 'next/image';
import { useGlobalContext } from '@/context/TopNavContext';
import { iSize } from '@/lib/types';

export interface iBannerProps {
  title: string;
  content: string;
  actions?: iButtonProps[];
  image?: ImageProps;
  size?: iSize;
}

const Banner: React.FC<iBannerProps> = ({
  title,
  content,
  actions,
  size = iSize.Small,
  image = { src: 'banner-image1.jpg', alt: 'banner image' },
}) => {
  const { isMobile } = useGlobalContext();

  const classSize = () => {
    switch (size) {
      case iSize.Small:
        return styles.small;
      case iSize.Medium:
        return styles.medium;
      case iSize.Large:
        return styles.large;
      default:
        return styles.small;
    }
  };

  return (
    <div
      className={`${styles.bannerContainer} ${classSize()}`}
      style={{ backgroundImage: `url("/image/${image.src}")` }}
    >
      <Container>
        <div className={styles.banner}>
          <div className={styles.content}>
            <LockUp title={title} subtitle={content} size={iSize.Medium} />
          </div>
          <Actions fullWidth={isMobile} actions={actions} />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
