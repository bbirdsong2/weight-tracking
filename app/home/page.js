'use client';

import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import HomeContainer from './components/HomeContainer';
import DataContainer from './components/DataContainer';
import { updateEntries, getHomeData, hydrateDays, sortEntries, CONTAINERS } from './util';
import { getPerson as gp2 } from './data';
import { addPerson, getPerson, updatePerson } from './database/firebase';
import { getPerson as oldGetPerson } from '../database/firebase';
import { v4 as uuidv4 } from 'uuid';
import SettingContainer from './components/SettingContainer';
import ChartContainer from './components/ChartContainer';
import { getNowJs, getTodayString } from './dates';
import PageWrapper from './page_wrapper';

export default function Home() {
    const searchParams = useSearchParams();

    /**
     * @type {ReturnType<typeof useState<any>>}
     */
    const [person, setPerson] = useState({});
    const [date, setDate] = useState(getNowJs());
    const [container, setContainer] = useState(1);
    /**
     * @type {ReturnType<typeof useState<any>>}
     */
    const [homeData, setHomeData] = useState([]);

    const registerPerson = async () => {
        // const newPerson = await addPerson({
        //     name: 'Newb 5',
        //     userId: 'newb5',
        //     settings: {
        //         chartDate: getTodayString(),
        //     },
        //     entries: [],
        // });
        // changePerson(newPerson);
    };

    const initLoadPerson = async (uid, convert) => {
        const person = await getPerson(uid);
        if (convert) {
            // This option will convert from the old API to the new one
            // This should be removed once users are moved over and using the new API
            /** @type {any} */
            const personToConvert = await oldGetPerson(uid);
            personToConvert.settings = {
                activityModifier: personToConvert.activityModifier,
                birthDate: personToConvert.birthDate,
                bodyFatPercentage: personToConvert.bodyFatPercentage,
                gender: personToConvert.gender,
            };
            person.settings = personToConvert.settings;
            person.entries = updateEntries(personToConvert.entries.length - 1, personToConvert);
        }
        changePerson(person);
    };

    const changePerson = (p) => {
        setPerson(p);
        setHomeData(getHomeData(date, p));
    };

    const changeDate = (newDate) => {
        setDate(newDate);
        setHomeData(getHomeData(newDate, person));
    };

    const updateDay = async (day) => {
        if (!day.id) {
            day.id = uuidv4();
            person.entries.push(day);
            person.entries = sortEntries(person.entries);
        }

        const i = person.entries.findIndex((e) => e.id === day.id);
        person.entries[i] = day;

        const updatedPerson = {
            ...person,
            entries: updateEntries(i, person),
        };

        await updatePerson(updatedPerson);

        setPerson(updatedPerson);

        setHomeData(getHomeData(date, updatedPerson));
    };

    const updateSettings = async (settings) => {
        const updatedPerson = {
            ...person,
            settings: settings,
        };
        // updatedPerson.entries = updateEntries(
        //   updatedPerson.entries.length - 1,
        //   updatedPerson,
        // );
        await updatePerson(updatedPerson);

        setPerson(updatedPerson);

        setHomeData(getHomeData(date, updatedPerson));
    };

    useEffect(() => {
        const userId = searchParams.get('uid');
        const convert = searchParams.get('convert');
        initLoadPerson(userId, convert);
    }, []);

    return (
        <PageWrapper>
            <NavBar person={person} registerPerson={registerPerson} setContainer={setContainer} />

            <Container style={{ marginTop: 20, marginBottom: 20 }} maxWidth="lg">
                {container === CONTAINERS.home && (
                    <HomeContainer date={date} changeDate={changeDate} stats={homeData.stats} deltas={homeData.deltas} setContainer={setContainer} />
                )}
                {container === CONTAINERS.data && (
                    <DataContainer days={hydrateDays(person.entries)} updateDay={updateDay} setContainer={setContainer} />
                )}
                {container === CONTAINERS.settings && (
                    <SettingContainer settings={person.settings} updateSettings={updateSettings} setContainer={setContainer} />
                )}
                {container === CONTAINERS.charts && <ChartContainer person={person} updateSettings={updateSettings} setContainer={setContainer} />}
            </Container>
        </PageWrapper>
    );
}
