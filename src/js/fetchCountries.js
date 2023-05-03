"use strict"
export function fetchCountries(name) {
     return fetch(`https://restcountries.com/v3.1/name/${name}?fields=${field}`).then(
        response => {
            if (!response.ok) throw new Error(response.status)
            return response.json();
        })
}
   
const field = 'name,capital,population,flags,languages'  