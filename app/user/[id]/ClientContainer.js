"use client";

import DayEntryView from '@/app/components/DayEntryView';
import DayEntryEdit from '@/app/components/DayEntryEdit';
import { useEffect, useState } from 'react';
import { Container, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import Header from '@/app/components/Header';
import { v4 as uuidv4 } from 'uuid';
import { getPerson, updatePerson } from '@/app/database/firebase';
import ChartModal from '@/app/components/ChartModal';
import { sortEntries, getDayViewMetrics } from '@/app/constants';

const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

export default function ClientContainer({ userId }) {

  const getPersonById = async () => {
    var person = await getPerson(userId);
    
    if (!person.entries) {
      person.entries = [];
      person.gender = '';
      person.bodyFatPercentage = '';
      person.birthDate = '';
      person.activityModifier = '';
    }

    setUser(person);
  }

  useEffect(() => {
    getPersonById();
  }, []);

  const [user, setUser] = useState();

  const [isEdit, setIsEdit] = useState(false);
  const [editEntry, setEditEntry] = useState();

  const addNewEntry = () => {
    openEdit({
      date: moment().format("YYYY-MM-DD"),
      weight: '',
      calories: '',
      steps: '',
    });
  }

  const openEdit = (entry) => {
    setEditEntry(entry);
    setIsEdit(true);
  }

  const saveEntry = async () => {
    const newEntries = [...user.entries];
    if (editEntry.id) {
      const i = newEntries.findIndex(e => e.id === editEntry.id);
      newEntries.splice(i, 1, editEntry);
    } else {
      newEntries.push({
        id: uuidv4(),
        ...editEntry
      });
    }

    updateUser({
      ...user,
      entries: sortEntries(newEntries)
    });
  }

  const removeEntry = (rEntry) => {
    updateUser({
      ...user,
      entries: user.entries.filter(e => e.id !== rEntry.id)
    });
  }

  const updateUser = async (updatedUser) => {
    setUser(updatedUser);
    await updatePerson(updatedUser);
  }

  if (!user) {
    return <>Loading...</>;
  }

  // This function reverses the array so we can iterate in day order and calc diff changes from the prev day
  // Then it reverses again to display in correct order.
  const loadEntryView = () => {
    let prev;
    let entries = [...user.entries];
    entries.reverse();
    const map = entries.map(e => {
      let { metrics, current } = getDayViewMetrics(user, e, prev);
      prev = current;

      return <DayEntryView
        key={e.id}
        user={user}
        entry={e}
        metrics={metrics}
        showEdit={() => openEdit(e)}
        remove={() => removeEntry(e)} />;
    });

    map.reverse();
    return map;
  };

  return (
    <>
      <Header user={user} updateUser={updateUser} />

      <ChartModal user={user} updateUser={updateUser} />

      <Container sx={{ padding: 2 }}>{loadEntryView()}</Container>

      {isEdit &&
      <DayEntryEdit 
        user={user}
        entry={editEntry} 
        setEntry={setEditEntry}
        hideEdit={() => setIsEdit(false)} 
        open={isEdit}
        save={saveEntry} />}

      {!isEdit && 
      <Fab size="medium" style={fabStyle} color="primary" onClick={addNewEntry}>
        <AddIcon />
      </Fab>}
    </>
  )
}
