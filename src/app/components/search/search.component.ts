import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface Filter {
  value: string;
  label: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  @Output() filter = new EventEmitter;
  filters: Filter[];
  filterForm: FormGroup;
  continents: string[];

  constructor() { }

  ngOnInit(): void {
    window.addEventListener('getContinents', () => this.getContinents());
    this.onInitForm();
    this.onInitFilters();
  }

  onInitForm(): void {
    this.filterForm = new FormGroup({
      text: new FormControl(''),
      filterSelected: new FormControl('all'),
    });
  }

  onInitFilters(): void {
    this.filters = [
      { value: 'all', label: 'Show All' },
      { value: 'fav', label: 'Favorites' }
    ]
  }

  onSearch(): void {
    this.filter.emit(this.filterForm.value);
  }

  getContinents(): void {
    this.continents = localStorage.getItem('continents').split(',');
    this.setContinentsToFilters();
  }

  setContinentsToFilters(): void {
    this.continents.forEach((continent: string) => {
      this.filters.push({ value: continent.toLowerCase(), label: continent });
    });
  }
}