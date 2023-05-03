import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInformation = document.querySelector('.country-info');

countryInformation.classList.add('is-hidden');
countriesList.classList.add('is-hidden');

searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
    const value = searchBox.value.trim();
    console.log(value);

    if (!value) {
        isdHidden();
        clearInterfaceUI();
        return;
    }

    fetchCountries(value)
        .then(data => {
            if (data.length > 10) {
                Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            }
            renderCountries(data);
        })
        .catch(err => {
            clearInterfaceUI();
            isdHidden();
            Notify.failure('Oops, there is no country with that name');
        });
}

const generateCountryInformation = data =>
    data.reduce(
        (acc, { flags: { svg }, name, capital, population, languages }) => {
            console.log(languages);
            languages = Object.values(languages).join(', ');
            console.log(name);
            return (
                acc +
                ` <img src="${svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`
            );
        },
        ''
    );

const generateCountryList = data =>
    data.reduce((acc, { name: { official, common }, flags: { svg } }) => {
        return (
            acc +
            `<li>
        <img src="${svg}" alt="${common}" width="70">
        <span>${official}</span>
      </li>`
        );
    }, '');

function renderCountries(result) {
    if (result.length === 1) {
        countriesList.innerHTML = '';
        countriesList.classList.add('is-hidden');
        countryInformation.classList.remove('is-hidden');
        countryInformation.innerHTML = generateCountryInformation(result);
    }
    if (result.length >= 2 && result.length <= 10) {
        countryInformation.innerHTML = '';
        countriesList.classList.remove('is-hidden');
        countryInformation.classList.add('is-hidden');
        countriesList.innerHTML = generateCountryList(result);
    }
}

function clearInterfaceUI() {
    countriesList.innerHTML = '';
    countryInformation.innerHTML = '';
}

function isdHidden() {
    countriesList.classList.add('is-hidden');
    countryInformation.classList.add('is-hidden');
}
