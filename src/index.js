(function(window){
    var bloomFilterData = "#BloomFilterDataPlaceholder#";
    var bloomFilterHashFunctions = "#BloomFilterHashFunctions#";
    var bf = new BloomFilter(bloomFilterData, bloomFilterHashFunctions); 
    
    window.IsPasswordSecure = function(password){
        return !bf.test(password);
    }
})(window);
