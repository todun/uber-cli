import build from './build';

import TimeUnit from '../../../data/TimeUnit';
import DistanceUnit from '../../../data/DistanceUnit';

jest.unmock('convert-units');

let expected;
let table;
let estimates;

const validateTable = (presentationUnits) => {
  console.log('expected table');
  console.log(expected);

  table = build({ estimates, presentationUnits });

  console.log('built table');
  console.log(table);

  expect(table).toEqual(expected);
};

describe('#build', () => {
  // tests use emojis and assumes process.platform = darwin
  // apologies in advance if this causes problems

  const realProcess = global.process;
  const mockedProcess = { platform: 'darwin' };

  const distance = {
    value: 12.34,
    unit: DistanceUnit.MILE,
  };
  const duration = {
    length: 5678,
    unit: TimeUnit.SECOND,
  };
  const currencyCode = 'USD';
  const start = { name: 'jae' };
  const end = { name: 'baebae' };
  const firstProduct = {
    productName: 'first product',
    range: {
      low: 10,
      high: 20,
      currencyCode,
    },
    distance,
    duration,
  };
  const secondProduct = {
    productName: 'second product',
    range: {
      low: 8,
      high: 16,
      currencyCode,
    },
    distance,
    duration,
  };
  const thirdProduct = {
    productName: 'third product',
    range: {
      low: 6,
      high: 12,
      currencyCode,
    },
    distance,
    duration,
  };
  const taxiProduct = {
    productName: 'TAXI',
    range: {
      low: 4,
      high: 8,
      currencyCode,
    },
    distance,
    duration,
  };

  const defaultEstimates = {
    estimates: [
      firstProduct,
      secondProduct,
      thirdProduct,
    ],
    start,
    end,
  };

  beforeEach(() => {
    global.process = mockedProcess;
  });

  afterEach(() => {
    global.process = realProcess;
  });

  it('should build sorted table', () => {
    estimates = defaultEstimates;
    expected = '┌────────────────┬─────────┬───────────┬────────────────────────┬──────────┐\n│       🚘        │    💸    │     🔃     │           ⏳            │ 😬 Surge😬 │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ third product  │ $6-$12  │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ second product │ $8-$16  │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ first product  │ $10-$20 │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┴───────────┴────────────────────────┴──────────┤\n│       📍        │ jae                                                     │\n├────────────────┼─────────────────────────────────────────────────────────┤\n│       🔚        │ baebae                                                  │\n└────────────────┴─────────────────────────────────────────────────────────┘';
    validateTable(DistanceUnit.MILE);
  });

  it('should build table without TAXI product', () => {
    estimates = {
      estimates: [
        firstProduct,
        secondProduct,
        thirdProduct,
        taxiProduct,
      ],
      start,
      end,
    };

    expected = '┌────────────────┬─────────┬───────────┬────────────────────────┬──────────┐\n│       🚘        │    💸    │     🔃     │           ⏳            │ 😬 Surge😬 │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ third product  │ $6-$12  │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ second product │ $8-$16  │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ first product  │ $10-$20 │ 12.34 mi. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┴───────────┴────────────────────────┴──────────┤\n│       📍        │ jae                                                     │\n├────────────────┼─────────────────────────────────────────────────────────┤\n│       🔚        │ baebae                                                  │\n└────────────────┴─────────────────────────────────────────────────────────┘';
    validateTable(DistanceUnit.MILE);
  });

  it('should build table converting to kilometers', () => {
    estimates = defaultEstimates;
    expected = '┌────────────────┬─────────┬───────────┬────────────────────────┬──────────┐\n│       🚘        │    💸    │     🔃     │           ⏳            │ 😬 Surge😬 │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ third product  │ $6-$12  │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ second product │ $8-$16  │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ first product  │ $10-$20 │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 🚫        │\n├────────────────┼─────────┴───────────┴────────────────────────┴──────────┤\n│       📍        │ jae                                                     │\n├────────────────┼─────────────────────────────────────────────────────────┤\n│       🔚        │ baebae                                                  │\n└────────────────┴─────────────────────────────────────────────────────────┘';
    validateTable(DistanceUnit.KILOMETER);
  });

  it('should build table with surge multiplier', () => {
    // probably a better way to do this but quick and dirty for now

    const firstProductWithSurge = {
      productName: 'first product with surge',
      range: {
        low: 10,
        high: 20,
        currencyCode,
      },
      distance,
      duration,
      surgeMultiplier: 1.23,
    };
    const secondProductWithSurge = {
      productName: 'second product with surge',
      range: {
        low: 8,
        high: 16,
        currencyCode,
      },
      distance,
      duration,
      surgeMultiplier: 2.34,
    };
    const thirdProductWithSurge = {
      productName: 'third product with surge',
      range: {
        low: 6,
        high: 12,
        currencyCode,
      },
      distance,
      duration,
      surgeMultiplier: 3.45,
    };
    estimates = {
      estimates: [
        firstProductWithSurge,
        secondProductWithSurge,
        thirdProductWithSurge,
      ],
      start,
      end,
    };

    expected = '┌───────────────────────────┬─────────┬───────────┬────────────────────────┬──────────┐\n│             🚘             │    💸    │     🔃     │           ⏳            │ 😬 Surge😬 │\n├───────────────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ third product with surge  │ $6-$12  │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 3.45x 😬  │\n├───────────────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ second product with surge │ $8-$16  │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 2.34x 😬  │\n├───────────────────────────┼─────────┼───────────┼────────────────────────┼──────────┤\n│ first product with surge  │ $10-$20 │ 19.86 km. │ 1 hrs. 34 min. 38 sec. │ 1.23x 😬  │\n├───────────────────────────┼─────────┴───────────┴────────────────────────┴──────────┤\n│             📍             │ jae                                                     │\n├───────────────────────────┼─────────────────────────────────────────────────────────┤\n│             🔚             │ baebae                                                  │\n└───────────────────────────┴─────────────────────────────────────────────────────────┘';
    validateTable(DistanceUnit.KILOMETER);
  });
});
