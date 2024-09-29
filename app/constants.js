import moment from "moment";

export const daysToAverageDefault = 14;

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

    return convert(totalMass / actualCount, decimals);
};

export const calculateDayMetabolicRate = (u, entry) => {
    const bodyWeightKg = calculateDayAverageLoss(u, entry, 30) / 2.2;
    const bodyFatPercentage = u.bodyFatPercentage / 100;
    const fatMass = bodyWeightKg * bodyFatPercentage;
    const leanBodyMass = bodyWeightKg - fatMass;
    const gender = u.gender === 'M' ? 1 : 0;
    const age = moment().diff(u.birthDate, 'years');
    const baseCals = (13.587 * leanBodyMass) + (9.613 * fatMass) + (198 * gender) - (3.351 * age) + 674;
    const baseWithActivity = baseCals * (u.activityModifier ?? 1.55);

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

export const getDayViewMetrics = (user, entry, prev) => {
    const current = {
        estCals: parseFloat(calculateDayMetabolicRate(user, entry)),
        avgCals: parseFloat(calculateAverageIntake(user, entry, user.daysToAverage ?? daysToAverageDefault)),
        avgWeight: parseFloat(calculateDayAverageLoss(user, entry, user.daysToAverage ?? daysToAverageDefault))
    };

    let estCalUnit = "kcals",
        avgCalUnit = "kcals",
        avgWeightUnit = "lbs";

    if (prev) {
        estCalUnit += ` (${convert(current.estCals - prev.estCals, 0)})`;
        avgCalUnit += ` (${convert(current.avgCals - prev.avgCals, 0)})`;
        avgWeightUnit += ` (${convert(current.avgWeight - prev.avgWeight)})`;
    }

    const metrics = [
        ["Estimated Calories", current.estCals, estCalUnit, "lightgrey"],
      ];

      if (user.daysToAverage) {

        metrics.push(
          [`${user.daysToAverage} day Average Calories`, current.avgCals, avgCalUnit, "lightcyan"],
          [`${user.daysToAverage} day Average Weight`, current.avgWeight, avgWeightUnit, "lightyellow"],
        )
      } else {
        // Defaults
        metrics.push(
          ["Weekly Average Calories", calculateAverageIntake(user, entry, 7), "kcals", "lightcyan"],
          ["2 Week Average Calories", calculateAverageIntake(user, entry, daysToAverageDefault), "kcals", "lightyellow"],
          ["Monthly Average Calories", calculateAverageIntake(user, entry, 30), "kcals", "lightblue"],
          ["Weekly Average Weight", calculateDayAverageLoss(user, entry, 7), "lbs", "lightcyan"],
          ["2 Week Average Weight", calculateDayAverageLoss(user, entry, daysToAverageDefault), "lbs", "lightyellow"],
          ["Monthly Average Weight", calculateDayAverageLoss(user, entry, 30), "lbs", "lightblue"]
        );
      }

      if (entry.steps) {
        metrics.push(["Steps", entry.steps, null, "seashell"])
      }

      return {
        current,
        metrics: metrics.map(m => ({
            name: m[0],
            value: m[1],
            unit: m[2],
            color: m[3],
          })),
      };
}

export const convert = (num, decimals) => num.toFixed(decimals ?? 2).toString().replace('.00', '');