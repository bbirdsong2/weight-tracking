import moment from 'moment';

export const daysToAverageDefault = 14;

export const calculateDayAverageLoss = (user, entry, days) => calculateAverage(user, entry, days, 'weight', 2);

export const calculateAverageIntake = (user, entry, days) => calculateAverage(user, entry, days, 'calories', 0);

export const calculateAverage = (user, entry, days, field, decimals) => {
    const i = user.entries.findIndex((e) => e.id === entry.id);
    const dayEntries = user.entries.slice(i, i + days);

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

export const calculateDayMetabolicRate = (u, entry) => {
    const bodyWeightKg = calculateDayAverageLoss(u, entry, 30) / 2.2;
    const bodyFatPercentage = u.bodyFatPercentage / 100;
    const fatMass = bodyWeightKg * bodyFatPercentage;
    const leanBodyMass = bodyWeightKg - fatMass;
    const gender = u.gender === 'M' ? 1 : 0;
    const age = moment().diff(u.birthDate, 'years');
    const baseCals = 13.587 * leanBodyMass + 9.613 * fatMass + 198 * gender - 3.351 * age + 674;
    const baseWithActivity = baseCals * (u.activityModifier ?? 1.55);

    return baseWithActivity.toFixed();
};

export const sortEntries = (entries, asc) => {
    if (!asc) {
        return entries.sort((a, b) => (moment(b.date).isAfter(a.date) ? 1 : -1));
    } else {
        return entries.sort((a, b) => (moment(b.date).isBefore(a.date) ? 1 : -1));
    }
};

export const updatePropertyField = (obj, e) => {
    return {
        ...obj,
        [e.target.name]: e.target.type === 'number' ? (!isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : '') : e.target.value,
    };
};

const getDeltaMetrics = (i, current, averages, days, metric) => {
    let deltas = [];
    days.forEach((day) => {
        if (averages.length >= day.lookback) {
            const prev = averages[i - day.lookback];
            deltas.push([`- ${day.name} ${metric.name} Change`, convert(current[metric.prop] - prev[metric.prop]), metric.label, metric.color]);
        }
    });

    return deltas;
};

export const getDayViewMetrics = (user, entry, i, averages) => {
    const current = {
        estCals: parseFloat(calculateDayMetabolicRate(user, entry)),
        avgCals: entry.calories ? parseFloat(calculateAverageIntake(user, entry, user.daysToAverage ?? daysToAverageDefault)) : 'NoData',
        avgWeight: entry.weight ? parseFloat(calculateDayAverageLoss(user, entry, user.daysToAverage ?? daysToAverageDefault)) : 'NoData',
    };

    let estCalDif = '',
        avgCalDif = '',
        avgWeightDif = '';

    // NOTE: Removing this for now since added as individual metrics
    // if (averages.length >= 1) {
    //     const prev = averages[i - 1];
    //     estCalDif += ` (${convert(current.estCals - prev.estCals, 0)})`;
    //     avgCalDif += entry.calories ? ` (${convert(current.avgCals - prev.avgCals, 0)})` : "";
    //     avgWeightDif += entry.weight ? ` (${convert(current.avgWeight - prev.avgWeight)})` : "";
    // }

    const metrics = [['Estimated Calories', current.estCals, 'kcals', 'lightgrey', estCalDif]];

    if (user.daysToAverage) {
        const deltaMetrics = [
            { lookback: 1, name: 'Daily' },
            { lookback: 7, name: 'Weekly' },
            { lookback: 30, name: 'Monthly' },
        ];

        const definedMetrics = [
            {
                prop: 'avgWeight',
                name: 'Weight',
                label: 'lbs',
                color: 'lightyellow',
                avgDif: avgWeightDif,
            },
            {
                prop: 'avgCals',
                name: 'Calorie',
                label: 'kcals',
                color: 'lightcyan',
                avgDif: avgCalDif,
            },
        ];

        definedMetrics.forEach((metric) => {
            metrics.push(
                [`${user.daysToAverage} day ${metric.name} Average`, current[metric.prop], metric.label, metric.color, metric.avgDif],
                ...getDeltaMetrics(i, current, averages, deltaMetrics, metric),
            );
        });
    } else {
        // Defaults
        metrics.push(
            ['Weekly Average Calories', calculateAverageIntake(user, entry, 7), 'kcals', 'lightcyan', ''],
            ['2 Week Average Calories', calculateAverageIntake(user, entry, daysToAverageDefault), 'kcals', 'lightyellow', ''],
            ['Monthly Average Calories', calculateAverageIntake(user, entry, 30), 'kcals', 'lightblue', ''],
            ['Weekly Average Weight', calculateDayAverageLoss(user, entry, 7), 'lbs', 'lightcyan', ''],
            ['2 Week Average Weight', calculateDayAverageLoss(user, entry, daysToAverageDefault), 'lbs', 'lightyellow', ''],
            ['Monthly Average Weight', calculateDayAverageLoss(user, entry, 30), 'lbs', 'lightblue', ''],
        );
    }

    if (entry.steps) {
        metrics.push(['Steps', entry.steps, null, 'seashell']);
    }

    averages.push(current);

    return {
        updatedAverages: averages,
        metrics: metrics.map((m) => ({
            name: m[0],
            value: m[1],
            unit: m[2],
            color: m[3],
            append: m[4],
        })),
    };
};

export const convert = (num, decimals) =>
    num
        .toFixed(decimals ?? 2)
        .toString()
        .replace('.00', '');
