import React from 'react';
import styles from './Footer.module.scss';
import Logo from '../Logo/Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterProps {
  links: FooterLink[];
}

const footerPaths = ['/', '/docs', '/auth/signin', '/auth/signup'];

const Footer: React.FC<FooterProps> = ({ links }) => {
  const router = useRouter();

  console.log(router.pathname);

  if (!footerPaths.includes(router.pathname)) {
    return null;
  }

  return (
    <footer className={styles.layout}>
      <div className={styles.inner}>
        <div className={styles.copyright}>
          <Logo />
          <div>
            ©<span className={styles.name}> Podwatch</span>{' '}
            {new Date().getFullYear()}
          </div>
        </div>
        <nav>
          <ul className={styles.list}>
            {links.map((link) => (
              <Link key={link.name} href={link.href}>
                <li>{link.name}</li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
