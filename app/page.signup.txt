"use client";

import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { daysToAverageDefault } from './constants';
import styles from './page.module.css';
import { useState } from 'react';
import { setPerson } from './database/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {

  const [name, setName] = useState("");
  const router = useRouter();

  const register = async () => {
    if (!name) {
      alert('Name is required.');
      return;
    }

    const id = crypto.randomUUID();

    await setPerson({
      id: id,
      userId: id,
      name: name,
      daysToAverage: daysToAverageDefault,
      daysToGraph: 365,
    });

    alert('Account Created! Please bookmark this page or save the url to access your account.')

    router.push(`/user?uid=${id}`);
  }

  return (
    <main className={styles.main}>
    <TextField
      sx={{ marginTop: 2, marginLeft: 2 }}
      size='small'
      onChange={(e) => {setName(e.target.value)}}
      name="Name"
      type="text"
      label="Name"
      value={name} />
    <Button
        sx={{ marginTop: 2, marginLeft: 2 }}
        color="primary"
        variant="contained"
        onClick={() => register()}>Register</Button>
    </main>
  )
}
