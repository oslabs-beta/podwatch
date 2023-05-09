import styles from './Hamburger.module.scss';

interface HamburgerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Hamburger = ({ open, setOpen }: HamburgerProps) => {
  const activeClass = `${styles.menuIcon} ${
    open ? styles.open : styles.closed
  }`;

  return (
    <button
      tabIndex={0}
      aria-expanded={open}
      aria-label="Menu"
      className={styles.menuIconContainer}
      onClick={(e) => {
        e.preventDefault();
        setOpen(!open);
      }}
    >
      <div className={activeClass} aria-hidden="true"></div>
    </button>
  );
};

export default Hamburger;
