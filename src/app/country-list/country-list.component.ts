import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountriesService } from '../services/countries.service';
import { FavoriteCountriesService } from '../services/favorite-countries.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.sass']
})
export class CountryListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() filters;
  allCountriesSubs: Subscription;
  countriesFilteredSubs: Subscription;
  allCountries: any[];
  countriesGrouped = {};
  continents: string[] = [];
  favoriteCountries: any[] = [];

  constructor(
    private countriesService: CountriesService,
    public utilServices: UtilsService,
    public favoriteCountriesService: FavoriteCountriesService) { }

  ngOnInit(): void {
    window.addEventListener('getFavoriteCountries', () => this.getFavoriteCountries());
    this.getCountries();
  }

  ngOnChanges(): void {
    if (this.filters) {
      this.applyFilters();
    }
  }

  ngOnDestroy(): void {
    this.allCountriesSubs.unsubscribe();
    this.countriesFilteredSubs.unsubscribe();
  }

  getCountries(): void {
    this.allCountriesSubs = this.countriesService.getCountries().subscribe(
      countries => {
        this.allCountries = countries;
        this.getContinents();
        if (this.continents?.length > 0) {
          this.continents.forEach(continent => {
            this.groupCountriesByContinent(continent);
          });
        }
      },
      error => console.log(error)
    );
  }

  groupCountriesByContinent(continent: string): void {
    this.countriesGrouped[continent] = this.allCountries.filter(country => country.region.toLowerCase() === continent.toLowerCase());
  }

  getContinents(): void {
    this.continents = [...new Set(this.allCountries.map(country => country.region))].filter(country => country && country != 'Polar');

    localStorage.setItem('continents', `${this.continents}`);
    window.dispatchEvent(new Event('getContinents'));
  }

  get filtersToSearch(): string {
    if (this.filters) {
      switch (this.filters.filterSelected) {
        case 'all':
          return 'all'
        case 'fav':
          return 'favorites'
        default:
          return `region/${this.filters.filterSelected}`;
      }
    }
  }

  applyFilters(): void {
    if (this.filters.filterSelected === 'all') {
      if (!this.filters.text) {
        this.countriesGrouped = {};
        this.getCountries();
      } else {
        this.continents.forEach(continent => {
          this.countriesGrouped[continent] = this.countriesGrouped[continent].filter(country => country.name.toLowerCase().includes(this.filters.text.toLowerCase()));
        });
      }
    } else if (!this.filters.text) {
      if (this.filtersToSearch != 'favorites') {
        this.countriesFilteredSubs = this.countriesService.getCountries(this.filtersToSearch).subscribe(
          results => {
            this.countriesGrouped = {};
            this.countriesGrouped[this.filters.filterSelected] = results
          }
        );
      } else {
        this.getFavoriteCountries();
      }
    } else {
      this.countriesGrouped[localStorage.getItem('currentFilter')] = this.countriesGrouped[localStorage.getItem('currentFilter')].filter(country => country.name.toLowerCase().includes(this.filters.text));
    }
  }

  getFavoriteCountries(): void {
    this.favoriteCountries = this.favoriteCountriesService.getFavoriteCountries();
  }
}
