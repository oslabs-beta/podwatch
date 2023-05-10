import Image, { StaticImageData } from 'next/image';
import React from 'react';
import styles from './TeamCards.module.scss';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  image: StaticImageData;
  link: string;
}

interface TeamCardProps {
  team: TeamMember[];
}

const TeamCards: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className={styles.outer}>
      <h2>Meet the Team</h2>
      <div className={styles.layout}>
        {team.map((member) => {
          return (
            <Link href={member.link}>
              <div key={member.name} className={styles.card}>
                <Image src={member.image} alt={member.name} />
                <div className={styles.overlay}></div>
                <div className={styles.title}>
                  <div>{member.name}</div>
                  <div>{member.role}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeamCards;
