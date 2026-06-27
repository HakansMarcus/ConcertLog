import { Component, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
})
export class Searchbar {
  constructor() {}
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
