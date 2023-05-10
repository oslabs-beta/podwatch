import React from 'react';
import styles from './Accordion.module.scss';
import AddIcon from '@mui/icons-material/Add';

interface AccordionProps {
  children: React.ReactNode;
  title: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div onClick={handleClick} className={styles.outer}>
      <button
        className={`${styles.button} ${
          open ? styles.buttonOpen : styles.buttonClosed
        }`}
      >
        <AddIcon sx={{ color: open ? '#fff' : '#000' }} />
      </button>
      <div className={styles.content}>
        <div className={styles.spacer}></div>
        <h2>{title}</h2>
        <div
          className={`${styles.children} ${
            open ? styles.childrenOpen : styles.childrenClosed
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
