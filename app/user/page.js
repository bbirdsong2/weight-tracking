'use client';

import styles from './page.module.css';
import ClientContainer from '@/app/components/ClientContainer';
import { useSearchParams } from 'next/navigation';

export default function Home() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('uid');

    return (
        <main className={styles.main}>
            <ClientContainer userId={userId} />
        </main>
    );
}
