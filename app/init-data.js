import moment from "moment";

var brendanData = [
    "6/26 176.8 2520 11.5k steps 5.3 miles 413 app workout",
    "6/27 176.4 2550 14k steps 6.5 miles 502 app workout",
    "6/28 174.6 2520 11.5k steps 5.5 miles 452 app no workout",
    "6/29 176.2 2600 13.5k steps 6.4 miles 484 app workout",
    "6/30 176.6 2620 12.1k steps 5.7 miles 427 workout",
    "7/1 176.6 2600 15.3k steps 7.7 miles 617 Saturday, ate late last night",
    "7/2 176.0 2650 12.9k 6.4 miles 503 Sunday",
    "7/3 177.2 2600 11.7k steps 5.4 miles 393 workout deload / less zone 2",
    "7/4 174.4 2850 14.5k steps 6.9 miles 534 app no workout (think time to increase to 2700-2800 still have hunger sometimes and feel like you could eat more at meals)",
    "7/5 175.2 2860 14.6k steps 6.9 miles, 530 app no workout, day off in Springfield with kids",
    "7/6 176.4 2850 12.2k steps 5.8 miles, 449 app deload workout",
    "7/7 176.4 2850 11.9k steps 5.7 miles, 455 app deload workout",
    "7/8 176.2 2850 14.7k 6.8 miles 515 app no workout Saturday ",
    "7/9 177.0 2800 14.2k steps 6.5 miles 486 app no workout, playground w kids",
    "7/10 177.2 2800 14.3k steps 6.7 miles 506 app workout medium",
    "7/11 176.8 2780 13.1k steps 6.1 miles 441 app workout medium",
    "7/12 174.6 2800 12k steps 5.7 miles 470 app no workout",
    "7/13 176.0 2970 12.2k steps 5.5 miles 403 hard workout",
    "7/14 176.8 2980 15.1k steps 7.2 miles 532 app calories",
    "7/15 177.0 3300 12.7k steps 6.1 miles 489 app calories, birthday, ate a lot of whipped topping cake, planned on it",
    "7/16 177.0 3600 11k steps 5.2 miles 400 app finished birthday cake, also Peyton’s wedding and are a lot of zaxby chicken",
    "7/17 179.8 2430 11.5k steps 5.6 miles, 421 app calories",
    "7/18 177.2 2550 12.1k steps 5.6 miles 413 app calories",
    "7/19 174.6 2560 11.8k steps, 5.8 miles 453 app cals",
    "7/20 176.2 2820 13.6k, 6.6 miles, 503 cal",
    "7/21 176.2 4250 13.8k 6.5 miles 487 app calories",
    "7/22 175.8 3760 11.7k 5.6 miles 411 app calories",
    "7/23 177.6 3580 11.7K 5.5 miles 422 app calories",
    "7/25 177.6 2580 13.2k 6.2 miles 460 app calories",
    "7/26 177.0 2450 11.2k 5.6 miles 441 app cals",
    "7/27 175.2 2610 12.5k 6 miles 491 app cals",
    "7/28 177.6 2790 12.1k 5.3 miles 389 app calories",
    "7/29 176.8 2870 11.6k 5.5 424 app cals",
    "7/30 178.2 2970 13.2k 6.4 491 app cals",
    "7/30 176.8 2640 11.7k 5.6 423 app cals",
    "7/31 176.8 2610 12k 5.8 428 app cals",
    "8/1 176.8 2600 12.2k 5.8 436 app cals",
    "8/2 175.2 2740 13.3k 6.4 504 app cals",
    "8/3 176.8 2830 12k 5.6 423 app cals",
    "8/4 176.8 2970 12.4K 6.2 497 app cals",
    "8/5 178.0 3540 20k 10.2 804 app cals",
    "8/7 178.0 2910 11.5k 5.3 368 app cals",
    "8/8 179.4 2640 12.2k 5.8 432 app cals",
    "8/9 175.6 2750 13k 6.3 518",
    "8/10 178.0 2720 11.4 5.5 433",
    "8/11 175.2 2810 13k 6.2 489",
    "8/12 178.0 2980 11.6k 5.6 432",
    "8/13 178.0 2950 13.2k 6.5 538",
    "8/14 177.6 2520 11.8k 5.9 494",
    "8/15 178.0 2710 12.2k 5.9 451",
    "8/16 178.2 2820 12k 5.9 458",
    "8/17 176.4 2750 11.8k 5.4 423",
    "8/17 177.6 2790 14.1K 6.3 486 ",
    "8/18 176.4 2920 12.5k 6.2 495",
    "8/19 178.8 2880 14k 6.8 562",
    "8/20 179.6 3180 11.3k 5.3 409",
    "8/21 180.2 2820 13.3k 6.3 468",
    "8/22 179.2 2850 13.1k 6.2 465",
    "8/23 176.6 2800 14.6k 7 548",
    "8/24 178.0 2800 13.7k 6.5 479",
    "8/25 179.4 2970 14.5l 6.8 454",
    "8/26 178.4 3160 12.8k 6.5 514",
    "8/27 178.4 2750 6.9k 3 180  worked on table though",
    "8/27 178.6 2840 12.2k 5.6 401",
    "8/28 178.2 2900 12.3k 5.7 400",
    "8/29 178.2 2770 11.3k 5.2 411",
    "8/30 177.8 2930 14k 6.4 460",
    "9/1 178.2 3290 13.1k 6.3 494",
    "9/2 180.0 2960 12.4K 5.8 446",
    "9/3 178.8 2830 11.4K 5.3 408",
    "9/4 179.8 2830 12.9k 6.2 458",
    "9/5 179.6 2880 12.6k 6 456",
    "9/6 177.0 2870 11.9k 6 506",
    "9/7 178.4 2930 12.6k 6.1 475",
    "9/8 178.8 3410 13.5k 6.5 488",
    "9/9 180.2 2880 18.3k 9 704",
    "9/10 179.4 2570 12.5k 5.9 461",
    "9/11 179.8 2980 12.6k 6 444",
    "9/12 179.8 2940 14.5k 7 550",
    "9/13 179.2 2930 13.5k 6.5 510",
    "9/14 179.2 2940 12.5k 5.9 440",
    "9/15 179.4 3370 12.8k 6 445",
    "9/16 180.4 3090 12k 5.83 441",
    "9/17 179.0 3060 12.7k 6.2 482",
    "9/18 180.4 3120 13.6k 6.7 501"
];

var kayla = [
    "8/14 130.0, 1339, 529 burn, 12665 steps",
    "8/15 129.2, 1484, 400 burn, 10156 steps",
    "8/16 129.0, 1507, 616 burn, 12457 steps",
    "8/17 128.2, 1426, 451 burn, 14076 steps",
    "8/18 128.4, 1488, 549 burn, 9574 steps",
    "8/19 130.0, 2500, 400 burn, 8472 steps",
    "8/20 131.6, 1800, 32 burn, 4962 steps",
    "8/21 132.8, 1606, 333 burn, 8282 steps",
    "8/22 132.2, 1450, 515 burn, 12154 steps",
    "8/23 130.4, 1520, 501 burn, 11739 steps",
    "8/24 130.0, 2000, 51 burn, 8265 steps",
    "8/25 130.0, 1643, 634 burn, 10425 steps",
    "8/26 131.8, 2200, 432 burn, 11839 steps",
    "8/27 131.8, 1700, 20 burn, 6050 steps",
    "8/28 131.4, 1530, 464 burn, 11454 steps",
    "8/29 130.8, 1530, 471 burn, 14419 steps",
    "8/30 130.0, 1511, 528 burn, 11697 steps",
    "8/31 130.2, 1700, 145 burn, 14191 steps",
    "9/1 129.2, 1650, 496 burn, 11000 steps",
    "9/2 130.4, 2500, 545 burn, 13000 steps",
    "9/3 132.2, 2500, 16 burn, 6000 steps",
    "9/4 131.8, 1750, 400 burn, 14000 steps",
    "9/5 132.2, 1600, 478 burn, 12520 steps",
    "9/6 131.4, 1700, 475 burn, 11272 steps",
    "9/7 130.4, 1600, 50 burn, 11073 steps",
    "9/8 129.8, 1650, 480 burn, 15431 steps ",
    "9/9 131.8, 3000, 387 burn, 14098 steps",
    "9/10 133.4, 2500, 108 burn, 12313 steps",
    "9/11 131.4, 1550, 474 burn, 11363 steps",
    "9/12 129.8, 1520, 427 burn, 12500 steps",
    "9/13 128.4, 1500, 316 burn, 12114 steps",
    "9/14 128.2, 1570, 413 burn, 11778 steps",
    "9/15 128.0, 2200, 409 burn, 7793 steps",
    "9/16 131.8, 2800, 287 burn, 9418 steps",
    "9/17 132.4, 2500, 32 burn, 3334 steps",
    "9/18 132.8, 1700, 434 burn,"
]

/**
 * Add a new set of data above for the person (string array of each entry, data is space separated)
 *  0 = DD/MM date
 *  1 = Weight
 *  2 = Calorie intake
 * Then, in user/[id]/pages, getPersonById in the if block, add the below code and change the person/key parameter to getEntries as needed
      person.entries = sortEntries(getEntries('kayla'));
      await updatePerson(person);
 * @param {*} person 
 * @returns 
 */
export const getEntries = (person) => {
    var data = [];
    if (person == 'brendan') {
        data = brendanData;
    } else if (person == 'kayla') {
        data = kayla;
    }

    var entries = [];
    var id = 1;
    data.forEach(s => {
        var ss = s.split(' ');
        entries.push({
            id: id,
            date: moment(ss[0] + '/' + moment().year().format('YYYY')).format('YYYY-MM-DD'),
            weight: parseFloat(ss[1]),
            calories: parseInt(ss[2])
        });
        id++;
    });

    return entries;
}


export const generateUserAndEntries = (count) => {
    let entries = [];

    let curDate = moment();

    function randomize(min, max) {
        const n1 = Math.floor(Math.random() * (max - min + 1) ) + min;
        const n = n1.toFixed(2).toString().replace('.00', '');
        return parseFloat(n);
    }

    Array(count).fill(0).forEach(() => {
        entries.push({
        id: uuidv4(),
        date: curDate.format("YYYY-MM-DD"),
        weight: randomize(180,200),
        calories: randomize(2500,3000),
        steps: randomize(5000,10000),
        });
        curDate = moment(curDate).subtract(1, "days");
    });


    let dbUser = {
        id: userId,
        name: 'Brendan',
        birthDate: '1989-07-17',
        gender: 'M',
        bodyWeight: 178,
        height: 72,
        bodyFatPercentage: 13,
        activityModifier: 1.55,
        entries: entries,
        // entries: [
        //   {
        //     id: 'e1',
        //     date: '2023-09-02',
        //     weight: 176.8,
        //     calories: 2600,
        //     steps: 11000,
        //     miles: 5.5,
        //     appCalories: 454,
        //     trained: true,
        //     activityModifier: 1.55,
        //   },
        //   {
        //     id: 'e2',
        //     date: '2023-09-01',
        //     weight: 177.0,
        //     calories: 2650,
        //     steps: 11000,
        //     miles: 5.5,
        //     appCalories: 454,
        //     trained: true,
        //     activityModifier: 1.55,
        //   },
        // ]
    };

    return dbUser;
};