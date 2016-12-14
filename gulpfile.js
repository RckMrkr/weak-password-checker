var gulp = require('gulp');
var fs = require("fs");
var bf = require("bloomfilter");
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var hashFunctions; 

gulp.task('default', function() {
  return gulp.src(['./node_modules/bloomfilter/bloomfilter.js','src/index.js'])
    .pipe(replace('"#BloomFilterDataPlaceholder#"', buildBloomFilter()))
    .pipe(replace('"#BloomFilterHashFunctions#"', hashFunctions))
    .pipe(concat('bloom.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('bloom.min.js'))
    .pipe(gulp.dest('./dist'))
});

function buildBloomFilter(){
  var passwords = fs.readFileSync("./src/top10000", "utf-8").split("\n");
  var acceptableFalsePositive = 0.001;
  var noOfPasswords = passwords.length;
  
  // Recommendation on size from: http://hur.st/bloomfilter
  var bits = Math.ceil((noOfPasswords * Math.log(acceptableFalsePositive)) / Math.log(1 / Math.pow(2, Math.log(2))));
  hashFunctions = Math.round(Math.log(2) * bits / noOfPasswords);
  
  var bloomFilter = new bf.BloomFilter(bits, hashFunctions);

  passwords.forEach(function(password){
    bloomFilter.add(password);
  });

  var serializedFilter = [].slice.call(bloomFilter.buckets);
  return JSON.stringify(serializedFilter);
}