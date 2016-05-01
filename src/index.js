import Pattern from './pattern';


export default class {

  constructor (patterns = []) {
    this.patterns = [];
    this.add(patterns);
  }

  add (patterns = []) {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
      }
    });

    return this.patterns;
  }

  remove (patterns = []) {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    this.patterns = this.patterns.filter((pattern) => {
      return patterns.indexOf(pattern) === -1;
    });

    return this.patterns;
  }

  test (content) {
    let result = false;

    this.patterns.forEach((pattern) => {
      const pattern_obj = new Pattern(pattern);
      if (pattern_obj.test(content) === true) {
        result = true;
      }
    });

    return result;
  }

}
