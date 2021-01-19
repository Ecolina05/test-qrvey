import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CountryComponent } from './components/country/country.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { CountryListComponent } from './country-list/country-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from './components/country/details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    CountryListComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }