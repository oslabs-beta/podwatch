import React from 'react';
import styles from './LandingContent.module.scss';
import Image, { StaticImageData } from 'next/image';
interface LandingContentProps {
  heroImage: StaticImageData;
  heroImageAlt: string;
  children: React.ReactNode;
}

const LandingContent: React.FC<LandingContentProps> = ({
  heroImage,
  heroImageAlt,
  children,
}) => {
  return (
    <div className={styles.layout}>
      <div>{children}</div>
      <div>
        <Image src={heroImage} alt={heroImageAlt} />
      </div>
    </div>
  );
};

export default LandingContent;
