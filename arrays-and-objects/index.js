exports.isArray = element => Array.isArray(element);
exports.isObject = element => typeof element === 'object';
exports.keys = object => {
  if (this.isObject(object)) {
    return Object.keys(object);
  }
  return new Error('The parameter must be an object!');
};
exports.values = object => {
  if (this.isObject(object)) {
    return Object.values(object);
  }
  return new Error('The parameter must be an object!');
};
exports.sort = container => {
  if (this.isArray(container)) {
    const isArrayOfNumbers = container.every(val => typeof val === 'number');
    if (isArrayOfNumbers) {
      return container.sort((a, b) => a - b);
    }
    return container.sort();
  } else if (this.isObject(container)) {
    const sortedContainer = {};
    const sortedArray = this.sort(this.keys(container));
    sortedArray.forEach(key => {
      sortedContainer[key] = container[key];
    });
    return sortedContainer;
  }
  return new Error('You can sort only arrays and objects(by keys).');
};

const internDeepCheckStringify = container => {
  if (this.isArray(container)) {
    // IF CONTAINER IS ARRAY
    // GET INDEXES WITH VALUES THAT HAVE INNER OBJECTS OR ARRAYS
    const innerIndexes = [];
    const innerArraysOrObjects = container.filter((val, index) => {
      if (this.isArray(val) || this.isObject(val)) {
        innerIndexes.push(index);
        return true;
      }
      return false;
    });
    // CHECK IF INNER KEYS EXISTS
    if (innerIndexes.length > 0) {
      // REMOVE INDEXES FROM ARRAY
      const removedInners = container.filter(
        (val, index) => !innerIndexes.includes(index)
      );
      // STRINGIFY INNER ARRAYS OR OBJECTS
      const stringifyInnerArraysOrObjects = innerArraysOrObjects.map(innerVal =>
        internDeepCheckStringify(innerVal)
      );
      // ADD INDEXES TO ARRAY
      removedInners.push(...stringifyInnerArraysOrObjects);
      // SORT ARRAY
      this.sort(removedInners);
      // STRINGIFY ARRAY
      return JSON.stringify(removedInners);
    }
    // NO VALUES THAT HAVE INNER OBJECTS OR ARRAYS IN ARRAY
    // SORT ARRAY
    const sortedContainer = this.sort(container);
    // STRINGIFY ARRAY
    return JSON.stringify(sortedContainer);
  } else if (this.isObject(container)) {
    // IF CONTAINER IS OBJECT
    // GET KEYS WITH VALUES THAT HAVE INNER OBJECTS OR ARRAYS
    const innerKeys = [];
    const innerArraysOrObjects = this.values(container).filter((val, index) => {
      if (this.isArray(val) || this.isObject(val)) {
        innerKeys.push(this.keys(container)[index]);
        return true;
      }
      return false;
    });
    // CHECK IF INNER KEYS EXISTS
    if (innerKeys.length > 0) {
      // REMOVE KEYS FROM OBJECT
      this.keys(container).forEach(key => {
        if (innerKeys.includes(key)) delete container[key];
      });
      // STRINGIFY INNER ARRAYS OR OBJECTS
      const stringifyInnerArraysOrObjects = innerArraysOrObjects.map(innerVal =>
        internDeepCheckStringify(innerVal)
      );
      // ADD STRINGIFIED VALUES
      stringifyInnerArraysOrObjects.forEach((innerVal, index) => {
        const keyName = innerKeys[index];
        container[keyName] = innerVal;
      });
      // SORT THE OBJECT
      const sortedContainer = this.sort(container);
      // STRINGIFY OBJECT
      return JSON.stringify(sortedContainer);
    }
    // NO VALUES THAT HAVE INNER OBJECTS OR ARRAYS IN OBJECT
    // SORT THE OBJECT
    const sortedContainer = this.sort(container);
    // STRINGIFY OBJECT
    return JSON.stringify(sortedContainer);
  }
};

exports.check = (container, property) => {
  // CHECK IF CONTAINER AND PROPERTY ARE NOT NULL
  if (container && property) {
    if (this.isArray(container)) {
      // IF CONTAINER IS ARRAY
      if (this.isArray(property) || this.isObject(property)) {
        const propertyFound = container.find(
          val =>
            typeof val === typeof property &&
            internDeepCheckStringify(val) === internDeepCheckStringify(property)
        );
        return typeof propertyFound !== 'undefined';
      }
      return container.includes(property);
    } else if (this.isObject(container)) {
      // IF CONTAINER IS OBJECT
      if (this.isArray(property) || this.isObject(property)) {
        const propertyFound = this.values(container).find(
          val =>
            typeof val === typeof property &&
            internDeepCheckStringify(val) === internDeepCheckStringify(property)
        );
        return typeof propertyFound !== 'undefined';
      }
      return (
        this.keys(container).includes(property) ||
        this.values(container).includes(property)
      );
    }
    return new Error(
      'The first prop needs to be an array or an object. This is the container in which you look for a property.'
    );
  }
  return new Error(
    'The first prop is a container(array/object) and the second prop the property(value or key/value if container is an object) the container has. Please make sure to fill both.'
  );
};

// console.log(this.values({ John: true, Mary: false })); // [ true, false ]
// console.log(this.values(true)); // Error: The parameter must be an object!
// console.log(this.values([1, 4, 2, 5])); // [ 1, 4, 2, 5 ]
// console.log(this.values({ 3: [4, 5, 6], 1: [7] })); // [ [ 7 ], [ 4, 5, 6 ] ]

// console.log(this.keys({ John: true, Mary: false })); // [ 'John', 'Mary' ]
// console.log(this.keys([1, 4, 2, 5])); // [ '0', '1', '2', '3' ]
// console.log(this.keys({ 3: [4, 5, 6] })); // [ '3' ]
// console.log(this.keys(1)); // Error: The parameter must be an object!

// console.log(this.isObject([1, 4, 2, 5])); // true (javascript sees arrays as objects)
// console.log(this.isObject(4)); // false
// console.log(this.isObject({ 3: [4, 5, 6] })); // true

// console.log(this.isArray([1, 4, 2, 5])); // true
// console.log(this.isArray(4)); // false
// console.log(this.isArray({ 3: [4, 5, 6] })); // false

// console.log(this.sort({ Noah: false, John: true, Mary: false })); // { John: true, Mary: false, Noah: false }
// console.log(this.sort(true)); // Error: You can sort only arrays and objects(by keys).
// console.log(this.sort([1, 4, 2, 5])); // [ 1, 2, 4, 5 ]
// console.log(this.sort({ 3: [8, 1, 3], 1: [7] })); // { '1': [ 7 ], '3': [ 4, 5, 6 ] }

// console.log(
//   this.check(
//     [
//       {
//         User: ['Mark'],
//         Access: { HomePage: true, People: ['Johanna', 'Sim'] },
//       },
//       'Noah',
//       'Michelle',
//     ],
//     {
//       Access: { People: ['Sim', 'Johanna'], HomePage: true },
//       User: ['Mark'],
//     }
//   )
// );
// console.log(
//   this.check(
//     [
//       'Madagascar',
//       [
//         'Toliara',
//         'Antananarivo',
//         {
//           Capital: 'Antananarivo',
//           Others: [
//             'largest island in the world',
//             'official',
//             { Currency: ['Malagasy ariary', true], Population: 26.26 },
//           ],
//           Language: 'Malagasy',
//         },
//       ],
//     ],
//     [
//       'Antananarivo',
//       'Toliara',
//       {
//         Language: 'Malagasy',
//         Capital: 'Antananarivo',
//         Others: [
//           { Population: 26.26, Currency: ['Malagasy ariary', true] },
//           'official',
//           'largest island in the world',
//         ],
//       },
//     ]
//   )
// );
// You can check only keys or values from an object (not other inner values)
// console.log(
//   this.check(
//     [
//       'Products',
//       [
//         'rice',
//         'oil',
//         {
//           vitamin: 'A',
//           locations: [
//             'Mali',
//             'Ecuador',
//             { Important: 1, Capital: ['Quito', true] },
//           ],
//         },
//       ],
//     ],
//     1
//   )
// );
// console.log(
//   this.check(
//     {
//       Nr: 1,
//       State: ['Alabama', 'Mexico'],
//     },
//     'State'
//   )
// );
// console.log(this.check('State')); // Error: The first prop needs to be an array or an object. This is the container in which you look for a property.
// console.log(this.check()); // Error: The first prop is a container(array/object) and the second prop the property(value or key/value if container is an object) the container has. Please make sure to fill both.
