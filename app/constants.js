import moment from "moment";

export const calculateDayAverageLoss = (user, entry, days) => calculateAverage(user, entry, days, 'weight', 2);

export const calculateAverageIntake = (user, entry, days) => calculateAverage(user, entry, days, 'calories', 0);

export const calculateAverage = (user, entry, days, field, decimals) => {
    const i = user.entries.findIndex(e => e.id === entry.id);
    const dayEntries = user.entries.slice(i, i + days);

    let totalMass;
    let actualCount = 1;
    if (dayEntries.length <= 1) {
        totalMass = dayEntries[0][field];
        totalMass = totalMass ? totalMass : 0;
    } else {
        actualCount = dayEntries.length !== days ? dayEntries.length : days;
        totalMass = dayEntries.reduce((a, b) => a + (b[field] ? b[field] : 0), 0);
    }

    return (totalMass / actualCount).toFixed(decimals).toString().replace('.00', '');
};

export const calculateDayMetabolicRate = (u, entry) => {
    const bodyWeightKg = calculateDayAverageLoss(u, entry, 30) / 2.2;
    const bodyFatPercentage = u.bodyFatPercentage / 100;
    const fatMass = bodyWeightKg * bodyFatPercentage;
    const leanBodyMass = bodyWeightKg - fatMass;
    const gender = u.gender === 'M' ? 1 : 2;
    const age = moment().diff(u.birthDate, 'years');
    const baseCals = (13.587 * leanBodyMass) + (9.613 * fatMass) + (198 * gender) - (3.351 * age) + 674;
    const baseWithActivity = baseCals * (u.activityModifier);

    return (baseWithActivity).toFixed();
}

export const sortEntries = (entries, asc) => {
    if (!asc) {
        return entries.sort((a, b) => moment(b.date).isAfter(a.date) ? 1 : -1);
    } else {
        return entries.sort((a, b) => moment(b.date).isBefore(a.date) ? 1 : -1);
    }
}

export const updatePropertyField = (obj, e) => {
    return {
        ...obj,
        [e.target.name]: e.target.type === 'number' ? (!isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : '') : e.target.value
    };
}