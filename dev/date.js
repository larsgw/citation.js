main = function(wikidataTime) {
  var date, rest, sign;
  sign = wikidataTime[0];
  rest = wikidataTime.slice(1);
  date = fullDateData(sign, rest);
  
  console.log(sign,'\n',rest,'\n',date)
  
  if (date.toString() === 'Invalid Date') {
    return parseInvalideDate(sign, rest);
  } else {
    return date;
  }
};

var fullDateData = function(sign, rest) {
  if (sign === '-') {
    return negativeDate(rest);
  } else {
    return positiveDate(rest);
  }
};

var positiveDate = function(rest) {
  return new Date(rest);
};

var negativeDate = function(rest) {
  var date;
  date = "-00" + rest;
  return new Date(date);
};

var parseInvalideDate = function(sign, rest) {
  var day, month, ref, year;
  ref = rest.split('T')[0].split('-'), year = ref[0], month = ref[1], day = ref[2];
  return fullDateData(sign, year);
};

var res = main("+2013-06-15T00:00:00Z")

console.log(res.getMonth())