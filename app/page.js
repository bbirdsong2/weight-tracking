"use client";

import styles from './page.module.css';

// TODO: Allow user selection / setup
export default function Home() {
  return (
    <main className={styles.main}>
      Go to your user landing page by appending your userid to the url, ex. user/[myUserId]

      To add new users, add to firebase with name and userId fields, then trigger GitHub pages build
    </main>
  )
}
