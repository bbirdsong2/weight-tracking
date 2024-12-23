import styles from '../page.module.css';
import ClientContainer from '@/app/components/ClientContainer';
import { getPersons } from '@/app/database/firebase';

export const dynamicParams = true;

export async function generateStaticParams() {
  const persons = await getPersons();
  return persons.map(p => ({ id: p.userId }));
}

export default function Home({ params }) {

  const userId = params.id;

  return (
    <main className={styles.main}>
      <ClientContainer userId={userId} />
    </main>
  )
}
