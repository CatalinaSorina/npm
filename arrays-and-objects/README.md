# Arrays and objects helper

You use arrays and objects in your project?
Than ... this package may be a very handy one for you (✿◕‿◕).

## How to use? Guide:

You have more functions available:
1. isArray: Check if the element passed is an array.
2. isObject: Check if the element passed is an object.
3. keys: Returns the keys of an object.
4. values: Return the values of an object.
5. sort: Sort an array or an object. Arrays of numbers are sorted ascending. Arrays of strings are sorted alphabetically. Object are sorted by keys.
6. check: A function with 2 parameters that checks if in a container(first prop that can be array or object) exist a value or a key(in addition to object). Also, it has a deep check if the property(second parameter) is an array or an object. See more details in the next examples.

### isArray function with prop element
```javascript
// isArray(element)
import { isArray } from 'arrays-and-objects';

console.log(isArray([1, 4, 2, 5])); // true
console.log(isArray(4)); // false
console.log(isArray({ 3: [4, 5, 6] })); // false

```
### isObject function with prop element
```javascript
// isObject(element)
import { isObject } from 'arrays-and-objects';

console.log(isObject([1, 4, 2, 5])); // true (javascript sees arrays as objects)
console.log(isObject(4)); // false
console.log(isObject({ 3: [4, 5, 6] })); // true

```
### keys function with prop object
```javascript
// keys(object)
import { keys } from 'arrays-and-objects';

console.log(keys({ John: true, Mary: false })); // [ 'John', 'Mary' ]
console.log(keys([1, 4, 2, 5])); // [ '0', '1', '2', '3' ]
console.log(keys({ 3: [4, 5, 6] })); // [ '3' ]
console.log(keys(1)); // Error: The parameter must be an object!

```
### values function with prop object
```javascript
// values(object)
import { values } from 'arrays-and-objects';

console.log(values({ John: true, Mary: false })); // [ true, false ]
console.log(values(true)); // Error: The parameter must be an object!
console.log(values([1, 4, 2, 5])); // [ 1, 4, 2, 5 ]
console.log(values({ 3: [4, 5, 6], 1: [7] })); // [ [ 7 ], [ 4, 5, 6 ] ]

```
### sort function with prop object or array (container)
```javascript
// sort(container)
import { sort } from 'arrays-and-objects';

console.log(sort({ Noah: false, John: true, Mary: false })); // { John: true, Mary: false, Noah: false }
console.log(sort(true)); // Error: You can sort only arrays and objects(by keys).
console.log(sort([1, 4, 2, 5])); // [ 1, 2, 4, 5 ]
console.log(sort({ 3: [8, 1, 3], 1: [7] })); // { '1': [ 7 ], '3': [ 8, 1, 3 ] }

```
### check function with the first prop a container and the second prop an property needed to be checked
```javascript
// check(container,property)
import { check } from 'arrays-and-objects';

console.log(
  check(
    [
      {
        User: ['Mark'],
        Access: { HomePage: true, People: ['Johanna', 'Sim'] },
      },
      'Noah',
      'Michelle',
    ],
    {
      Access: { People: ['Sim', 'Johanna'], HomePage: true },
      User: ['Mark'],
    }
  )
); // true, because every array and object is sorted

console.log(
  check(
    [
      'Madagascar',
      [
        'Toliara',
        'Antananarivo',
        {
          Capital: 'Antananarivo',
          Others: [
            'largest island in the world',
            'official',
            { Currency: ['Malagasy ariary', true], Population: 26.26 },
          ],
          Language: 'Malagasy',
        },
      ],
    ],
    [
      'Antananarivo',
      'Toliara',
      {
        Language: 'Malagasy',
        Capital: 'Antananarivo',
        Others: [
          { Population: 26.26, Currency: ['Malagasy ariary', true] },
          'official',
          'largest island in the world',
        ],
      },
    ]
  )
); // true

console.log(
  check(
    [
      'Products',
      [
        'rice',
        'oil',
        {
          vitamin: 'A',
          locations: [
            'Mali',
            'Ecuador',
            { Important: 1, Capital: ['Quito', true] },
          ],
        },
      ],
    ],
    1
  )
); // false, you cannot check deep inner values

console.log(
  check(
    {
      Nr: 1,
      State: ['Alabama', 'Mexico'],
    },
    'State'
  )
); // true

console.log(check('State')); // Error: The first prop needs to be an array or an object. This is the container in which you look for a property.
console.log(check()); // Error: The first prop is a container(array/object) and the second prop the property(value or key/value if container is an object) the container has. Please make sure to fill both.

```

If you encounter any error, or you have suggestions to improve this pack with more functions, don't hesitate to write me on gherzan.catalina@yahoo.com ^_^.