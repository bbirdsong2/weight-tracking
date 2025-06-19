import { MonitorWeight, Whatshot } from '@mui/icons-material';
import { convertToJs, convertToString, getNowJs } from './dates';

const DEFAULT_DAYS_TO_AVERAGE = 14;
const DEFAULT_DAYS = 30;
export const CALORIES_IN_POUND = 3500;
export const CONTAINERS = {
    home: 1,
    data: 2,
    settings: 3,
    charts: 4,
};

const calculateDayAverageLoss = (user, entry, days) => calculateAverage(user, entry, days, FIELDS.weight.prop, 2);

const calculateAverageIntake = (user, entry, days) => calculateAverage(user, entry, days, FIELDS.calories.prop, 0);

const calculateAverage = (user, entry, days, field, decimals) => {
    const i = user.entries.findIndex((e) => e.id === entry.id);
    const dayEntries = sliceEntriesByDate(convertToJs(user.entries[i].date), days, user.entries);

    let totalMass;
    let actualCount = 1;
    if (dayEntries.length <= 1) {
        totalMass = dayEntries[0][field];
        totalMass = totalMass ? totalMass : 0;
    } else {
        actualCount = dayEntries.length !== days ? dayEntries.length : days;
        totalMass = dayEntries.reduce((a, b) => {
            if (!b[field]) {
                actualCount--; // remove day if no value
            }
            return a + (b[field] ? b[field] : 0);
        }, 0);
    }

    return convert(totalMass / actualCount, decimals);
};

export const FIELDS = {
    weight: {
        prop: 'weight',
        label: 'Weight',
        avgFunc: calculateDayAverageLoss,
        suggestFunc: null,
        statFunc: (entries) => {
            // the find function gets the first not null weight average
            const mostRecentAvgWeight = entries.find((e) => e.averages[FIELDS.weight.prop]);
            return mostRecentAvgWeight ? mostRecentAvgWeight.averages[FIELDS.weight.prop] : null;
        },
        Icon: MonitorWeight,
    },
    calories: {
        prop: 'calories',
        label: 'Calories',
        avgFunc: calculateAverageIntake,
        suggestFunc: null,
        statFunc: (entries) => {
            // the find function gets the first not null mbr entry
            const mostRecentMbr = entries.find((e) => e.mbr);
            return mostRecentMbr ? mostRecentMbr.mbr : null;
        },
        Icon: Whatshot,
    },
};

export const mapFields = (getObj) => {
    return Object.keys(FIELDS).map((key) => getObj(key, FIELDS[key]));
};

const reduceFields = (getValue) => {
    return Object.keys(FIELDS).reduce(
        (a, key) => ({
            ...a,
            [key]: getValue(FIELDS[key]),
        }),
        {},
    );
};

const findEntryByDate = (entries, date) => {
    return entries.find((e) => e.date === convertToString(date));
};

const sliceEntriesByDate = (start, dayCount, entries) => {
    let startDate = start;
    const endDate = start.subtract(dayCount, 'day'); // +1 since only checking isAfter
    const slice = [];
    while (startDate.isAfter(endDate)) {
        const day = findEntryByDate(entries, startDate);
        if (day) {
            slice.push(day);
        }
        startDate = startDate.subtract(1, 'day');
    }
    return slice;
};

/**
 * This function sums the total calorie intake and subtracts the calorie diff of the sum of weight diff of the found entries.
 * i.e. (actualCalIntake - avgWeightChangeInCals) / days = mbr
 */
const calculateMetabolicRate = (i, entries) => {
    let cur = i,
        days = 0,
        totalWeightDiff = 0,
        totalCalIntake = 0;

    while (
        cur + 1 < entries.length && // Check cur+1 since checking prev day data too
        cur < i + DEFAULT_DAYS_TO_AVERAGE &&
        days < DEFAULT_DAYS_TO_AVERAGE
    ) {
        const entry = entries[cur];
        const prevEntry = entries[cur + 1];
        // Only use entries that have both an average weight and calories set
        // Then use the prev found entry average weight to calc the weightDiff of the entries
        if (entry.averages.weight && prevEntry.averages.weight && prevEntry.calories) {
            const dayAvgDiff = parseFloat(entry.averages.weight) - parseFloat(prevEntry.averages.weight);
            // TODO: CLEAN THIS UP, REPLACE WITH ACTUAL ESTCALS
            // Basically take prevDay calories (recorded) - prevDay avgCals (14 day avg)
            // If the actual day diff is greater than that diff ->
            // Then we will use the smaller #, because most likely you didn't lose the bigger #
            // The bigger # is probably just from water weight loss or something, so this
            // fixes the issue of huge/fast weight loss jumps.
            // TEST if this works with weight gain too. Probably more an issue with weight loss

            // TODO: ALSO ENHANCE DELTA CALCULATIONS SIMILAR TO THIS
            // Weight Delta = Sum of CalIntake - MBR for each day, this should be more accurate than just diffing the averages
            // Calorie Delta = MBR diff of days (no real change, vs using MBR rather than diff)

            // QUESTION: Which cals to subtract?
            // - prevEntry's estimatedMbr, mbr, or averages.calories?
            // - Test with data: also default to estimatedMbr if mbr or averages.calories is null (only on the first record essentialyl)
            // Only check prevDay diff if mbr calculated (should only be null on the very first entry)
            const prevDayEstDiff = prevEntry.mbr ? (prevEntry.calories - prevEntry.mbr) / CALORIES_IN_POUND : 0;
            totalWeightDiff += Math.abs(dayAvgDiff) > Math.abs(prevDayEstDiff) ? prevDayEstDiff : dayAvgDiff;
            totalCalIntake += parseFloat(prevEntry.calories);
            days++;
        }
        cur++;
    }
    return days <= 0 ? null : convert((totalCalIntake - totalWeightDiff * CALORIES_IN_POUND) / days, 0);
};

export const calculateEstimatedEquationDayMetabolicRate = (metrics, bodyWeight) => {
    const bodyWeightKg = bodyWeight / 2.2;
    const bodyFatPercentage = metrics.bodyFatPercentage / 100;
    const fatMass = bodyWeightKg * bodyFatPercentage;
    const leanBodyMass = bodyWeightKg - fatMass;
    const gender = metrics.gender === 'M' ? 1 : 0;
    const age = getNowJs().diff(metrics.birthDate, 'years');
    const baseCals = 13.587 * leanBodyMass + 9.613 * fatMass + 198 * gender - 3.351 * age + 674;
    const baseWithActivity = baseCals * (metrics.activityModifier ?? 1.55);

    return baseWithActivity.toFixed();
};

const getDeltas = (i, entries) => {
    const deltas = [
        { prop: 'day', name: 'Daily Change', days: 1 },
        { prop: 'week', name: 'Weekly Change', days: 7 },
        { prop: 'twoWeek', name: '2 Week Change', days: 14 },
        { prop: 'month', name: 'Monthly Change', days: 30 },
    ];

    const _getDelta = (d, prop) => {
        // Slice to get entries to check, in case we have less entries than days
        const data = sliceEntriesByDate(convertToJs(entries[i].date), d.days + 1, entries);
        // const data = entries.slice(i, i + d.days + 1); // +1 to get the extra day to compare
        // if not enough data, do not calculate
        if (data.length === d.days + 1 && data[0].averages) {
            const val = parseFloat(data[0].averages[prop]) - parseFloat(data[data.length - 1].averages[prop]);
            return !isNaN(val) ? convert(val) : null;
        }
        return null;
    };

    return deltas.reduce(
        (a, d) => ({
            ...a,
            [d.prop]: {
                ...d,
                ...reduceFields((f) => _getDelta(d, f.prop)),
            },
        }),
        {},
    );

    // return deltas.map((d) => ({
    //   ...d,
    //   ...reduceFields((f) => _getDelta(d, f.prop)),
    // }));
};

export const updateEntries = (start, p) => {
    for (let i = start; i >= 0; i--) {
        p.entries[i].averages = reduceFields((f) => (p.entries[i][f.prop] ? f.avgFunc(p, p.entries[i], DEFAULT_DAYS_TO_AVERAGE) : null));
        p.entries[i].suggests = reduceFields((f) => (f.suggestFunc ? f.suggestFunc(p, p.entries[i], DEFAULT_DAYS_TO_AVERAGE) : null));
        p.entries[i].mbr = calculateMetabolicRate(i, p.entries);
        p.entries[i].estimatedMbr = calculateEstimatedEquationDayMetabolicRate(p.settings, p.entries[i].averages.weight);
        p.entries[i].deltas = getDeltas(i, p.entries);
    }
    return p.entries;
};

export const hydrateDays = (days) => {
    const hydratedDays = [];
    let curDay = getNowJs();
    const lastDayToLoad = (days.length > 0 ? convertToJs(days[days.length - 1].date) : curDay).subtract(DEFAULT_DAYS + 1, 'day'); // +1 since using isAfter
    while (curDay.isAfter(lastDayToLoad)) {
        const formattedDate = convertToString(curDay);
        const existingDay = days.find((d) => formattedDate === d.date);
        hydratedDays.push(
            existingDay ?? {
                // id: uuidv4(),
                date: formattedDate,
                ...reduceFields(() => ''),
            },
        );
        curDay = curDay.subtract(1, 'day');
    }
    return hydratedDays;
};

export const getHomeData = (date, person) => {
    const formattedDate = convertToString(date);
    const daysToEvaluate = sliceEntriesByDate(
        date,
        DEFAULT_DAYS + 1, // +1 to exclude the current day from the 30 days
        person.entries,
    );
    return {
        stats: mapFields((key, field) => ({
            value: field.statFunc(daysToEvaluate),
            missing: DEFAULT_DAYS - daysToEvaluate.filter((d) => d[field.prop] && d.date !== formattedDate).length,
            Icon: field.Icon,
        })),
        deltas: daysToEvaluate.length > 0 ? daysToEvaluate[0].deltas : [],
    };
};

export const convert = (num, decimals) =>
    num
        .toFixed(decimals ?? 2)
        .toString()
        .replace('.00', '');

export const sortEntries = (entries, asc) => {
    if (!asc) {
        return entries.sort((a, b) => (convertToJs(b.date).isAfter(convertToJs(a.date)) ? 1 : -1));
    } else {
        return entries.sort((a, b) => (convertToJs(b.date).isBefore(convertToJs(a.date)) ? 1 : -1));
    }
};
