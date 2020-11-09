exports.isArray = (element) => Array.isArray(element);
exports.isObject = (element) => typeof element === 'object';
exports.keys = (object) => {
  if (this.isObject(object)) {
    return Object.keys(object);
  }
  return new Error('The parameter must be an object!');
};
exports.values = (object) => {
  if (this.isObject(object)) {
    return Object.values(object);
  }
  return new Error('The parameter must be an object!');
};
exports.sort = (container) => {
  if (this.isArray(container)) {
    const isArrayOfNumbers = container.every((val) => typeof val === 'number');
    if (isArrayOfNumbers) {
      return container.sort((a, b) => a - b);
    }
    return container.sort();
  } else if (this.isObject(container)) {
    const sortedContainer = {};
    const sortedArray = this.sort(this.keys(container));
    sortedArray.forEach((key) => {
      sortedContainer[key] = container[key];
    });
    return sortedContainer;
  }
  return new Error('You can sort only arrays and objects(by keys).');
};
exports.checkIfEmpty = (container) => {
  // CHECK IF container IS ARRAY
  if (this.isArray(container)) {
    return container.length === 0;
  }
  // CHECK IF container IS OBJECT
  if (this.isObject(container)) {
    return this.keys(container).length === 0;
  }
  return new Error('Please provide an object or an array.');
};

const internDeepCheckStringify = (container) => {
  // IF CONTAINER IS ARRAY
  if (this.isArray(container)) {
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
    if (!this.checkIfEmpty(innerIndexes)) {
      // REMOVE INDEXES FROM ARRAY
      const removedInners = container.filter(
        (val, index) => !innerIndexes.includes(index)
      );
      // STRINGIFY INNER ARRAYS OR OBJECTS
      const stringifyInnerArraysOrObjects = innerArraysOrObjects.map(
        (innerVal) => internDeepCheckStringify(innerVal)
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
  }
  // IF CONTAINER IS OBJECT
  if (this.isObject(container)) {
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
    if (!this.checkIfEmpty(innerKeys)) {
      // REMOVE KEYS FROM OBJECT
      this.keys(container).forEach((key) => {
        if (innerKeys.includes(key)) delete container[key];
      });
      // STRINGIFY INNER ARRAYS OR OBJECTS
      const stringifyInnerArraysOrObjects = innerArraysOrObjects.map(
        (innerVal) => internDeepCheckStringify(innerVal)
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
    // IF CONTAINER IS ARRAY
    if (this.isArray(container)) {
      if (this.isArray(property) || this.isObject(property)) {
        const propertyFound = container.find(
          (val) =>
            typeof val === typeof property &&
            internDeepCheckStringify(val) === internDeepCheckStringify(property)
        );
        return typeof propertyFound !== 'undefined';
      }
      return container.includes(property);
    }
    // IF CONTAINER IS OBJECT
    if (this.isObject(container)) {
      if (this.isArray(property) || this.isObject(property)) {
        const propertyFound = this.values(container).find(
          (val) =>
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
exports.checkAllBoolean = (container, conditionFunction) => {
  // CHECK IF container IS NOT NULL OR EMPTY
  if (container !== null && typeof container !== 'undefined') {
    // CHECK IF container IS ARRAY
    if (this.isArray(container)) {
      // CHECK IF THERE IS conditionFunction
      if (conditionFunction) {
        const checkedElements = container.map((element) =>
          conditionFunction(element)
        );
        return checkedElements.every(Boolean);
      }
      return container.every(Boolean);
    }
    // CHECK IF container IS OBJECT
    if (this.isObject(container)) {
      // CHECK IF THERE IS conditionFunction
      if (conditionFunction) {
        const checkedElements = this.values(container).map((val) =>
          conditionFunction(val)
        );
        return checkedElements.every(Boolean);
      }
      return this.values(container).every(Boolean);
    }
    return new Error('Please provide an object or an array.');
  }
  return new Error('Please provide an object or an array with elements.');
};
exports.tableHeadBodyStructure = (container, keysOrderArrayIndex = 0) => {
  // CHECK IF container IS NOT NULL OR EMPTY
  if (container !== null && !this.checkIfEmpty(container)) {
    // CHECK IF container IS ARRAY AND HAS OBJECTS
    if (
      this.isArray(container) &&
      this.checkAllBoolean(container, this.isObject)
    ) {
      // CREATE HEAD AND BODY
      const HEAD = this.keys(container[keysOrderArrayIndex]);
      const BODY = container.map((obj) => {
        const column = HEAD.map((key) => obj[key]);
        return column;
      });
      return {
        HEAD: HEAD,
        BODY: BODY,
      };
    }
    // IF container IS ONLY OBJECT
    if (this.isObject(container)) {
      // CREATE HEAD AND BODY
      const HEAD = this.keys(container);
      const BODY = this.values(container);
      return {
        HEAD: HEAD,
        BODY: BODY,
      };
    }
    return new Error('Please provide an object or an array.');
  }
  return new Error('Please provide an object or an array with elements.');
};

// console.log(this.checkAllBoolean('Table')); //Error: Please provide an object or an array.
// console.log(
//   this.checkAllBoolean(
//     [
//       { NAME: 'John', AGE: 45 },
//       { NAME: 'Mary', AGE: 25 },
//     ],
//     person => person.AGE >= 26
//   )
// ); //false
// console.log(
//   this.checkAllBoolean(
//     [
//       { NAME: 'John', AGE: 45 },
//       { NAME: 'Mary', AGE: 26 },
//     ],
//     person => person.AGE >= 26
//   )
// ); //true
// console.log(this.checkIfEmpty('Table')); //Error: Please provide an object or an array.
// console.log(this.checkIfEmpty({ Name: '', Age: '' })); //false
// console.log(this.checkIfEmpty({ Name: 'John', Age: 23542 })); //false
// console.log(this.checkIfEmpty({})); //true
// console.log(this.tableHeadBodyStructure('Table')); // Error: Please provide an object or an array with elements.
// console.log(this.tableHeadBodyStructure()); // Error: Please provide an object or an array with elements.
// console.log(this.tableHeadBodyStructure({})); // Error: Please provide an object or an array with elements.
// console.log(this.tableHeadBodyStructure([123, 324, 34, 3])); //{ HEAD: [ '0', '1', '2', '3' ], BODY: [ 123, 324, 34, 3 ] }
// console.log(
//   this.tableHeadBodyStructure({
//     John: { AGE: 45, PROFILE: 'Active' },
//     Lucas: { AGE: 38, PROFILE: 'Inactive' },
//     Mary: { AGE: 35, PROFILE: 'Active' },
//   })
// );
// {
//   HEAD: [ 'John', 'Lucas', 'Mary' ],
//   BODY: [
//     { AGE: 45, PROFILE: 'Active' },
//     { AGE: 38, PROFILE: 'Inactive' },
//     { AGE: 35, PROFILE: 'Active' }
//   ]
// }
// console.log(
//   this.tableHeadBodyStructure([
//     { NAME: 'John', AGE: 45, PROFILE: 'Active' },
//     { AGE: 38, PROFILE: 'Inactive', NAME: 'Lucas' },
//     { NAME: 'Mary', PROFILE: 'Active', AGE: 35 },
//   ])
// );
// {
//   HEAD: [ 'NAME', 'AGE', 'PROFILE' ],
//   BODY: [
//     [ 'John', 45, 'Active' ],
//     [ 'Lucas', 38, 'Inactive' ],
//     [ 'Mary', 35, 'Active' ]
//   ]
// }
// console.log(
//   this.tableHeadBodyStructure(
//     [
//       { NAME: 'John', AGE: 45, PROFILE: 'Active' },
//       { AGE: 38, PROFILE: 'Inactive', NAME: 'Lucas' },
//       { PROFILE: 'Active', NAME: 'Mary', AGE: 35 },
//     ],
//     2
//   )
// );
// {
//   HEAD: [ 'PROFILE', 'NAME', 'AGE' ],
//   BODY: [
//     [ 'Active', 'John', 45 ],
//     [ 'Inactive', 'Lucas', 38 ],
//     [ 'Active', 'Mary', 35 ]
//   ]
// }
// console.log(
//   this.tableHeadBodyStructure({ NAME: 'John', AGE: 45, PROFILE: 'Active' })
// );
// { HEAD: [ 'NAME', 'AGE', 'PROFILE' ], BODY: [ 'John', 45, 'Active' ] }

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
// ); // true
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
// ); // true
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
// ); // false
// console.log(
//   this.check(
//     {
//       Nr: 1,
//       State: ['Alabama', 'Mexico'],
//     },
//     'State'
//   )
// ); // true
// console.log(this.check('State')); // Error: The first prop needs to be an array or an object. This is the container in which you look for a property.
// console.log(this.check()); // Error: The first prop is a container(array/object) and the second prop the property(value or key/value if container is an object) the container has. Please make sure to fill both.
