const { db, Gardener, Plot, Vegetable } = require('./models');

const vegetablesData = [
  { name: 'beets', color: 'purple', planted_on: Date.now() },
  { name: 'cucumbers', color: 'green', planted_on: Date.now() },
  { name: 'carrots', color: 'orange', planted_on: Date.now() },
  { name: 'tomatoes', color: 'red', planted_on: Date.now() }
];

const gardenerData = [
  { name: 'gerry', age: 24 },
  { name: 'ethan', age: 25 },
  { name: 'anna', age: 32 }
];

const plotData = [
  { size: 40, shaded: true },
  { size: 47, shaded: false },
  { size: 100, shaded: false }
];

db.sync({ force: true })
  .then(() => {
    console.log('Database synced!');
    const promiseForVeggies = Vegetable.bulkCreate(vegetablesData, {
      returning: true,
    });
    const promiseForGardener = Gardener.bulkCreate(gardenerData, {
      returning: true,
    });
    const promiseForPlot = Plot.bulkCreate(plotData, {
      returning: true,
    });
    return Promise.all([promiseForVeggies, promiseForGardener, promiseForPlot]);
  })
  .then(insertedData => {
    const [veggies, gardeners, plots] = insertedData;
    const [beets, cucumbers, carrots, tomatoes] = veggies;
    const [gerry, ethan, anna] = gardeners;
    const [one, two, three] = plots;

    const promise1 = gerry.setPlot(one);
    const promise2 = ethan.setPlot(two);
    const promise3 = anna.setPlot(three);

    const promise4 = one.setVegetables([carrots, beets]);
    const promise5 = two.setVegetables([carrots, cucumbers]);
    const promise6 = three.setVegetables([cucumbers]);

    const promise7 = gerry.setFavorite_vegetable(beets);
    const promise8 = ethan.setFavorite_vegetable(carrots);
    const promise9 = anna.setFavorite_vegetable(cucumbers);

    return Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
      promise6,
      promise7,
      promise8,
      promise9,
    ]);
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    db.close();
});
