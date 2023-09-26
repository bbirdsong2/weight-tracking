"use client";

import styles from './page.module.css';

// TODO: Allow user selection / setup
export default function Home() {
  return (
    <main className={styles.main}>
      Go to your user landing page by appending your userid to the url, ex. /myUserId
    </main>
  )
}
