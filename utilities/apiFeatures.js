module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = JSON.parse(JSON.stringify(queryString));
    this.excludedFields = ['page', 'sort', 'limit', 'fields']; // Fields to exclude from filtering
  }

  filtering() {
    const queryObj = JSON.parse(JSON.stringify(this.queryString));

    // Filter out excluded fields from the query object
    const filteredQuery = Object.keys(queryObj)
      .filter(key => !this.excludedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = queryObj[key];
        return obj;
      }, {}); // Initialize with an empty object {}

    // Replace comparison operators with MongoDB query operators
    let queryStr = JSON.stringify(filteredQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Return the APIFeatures instance for method chaining
  }
};
