/**
 * ...
 * @author Danny Marcowitz
 */

 var allcountries = {"countries": [
        		{"id": "1", "name":"italy", "levelToUnlock":1},
				{"id": "2", "name":"france", "levelToUnlock":3},
				{"id": "3", "name":"japan", "levelToUnlock":5},
				{"id": "4", "name":"egypt", "levelToUnlock":7},
				{"id": "5", "name":"usa", "levelToUnlock":9},
				{"id": "6", "name":"mexico", "levelToUnlock":11}
    ]
};

function CountryDB() {
}

CountryDB.prototype.getAllCountries = function() {
	return allcountries.countries;
}