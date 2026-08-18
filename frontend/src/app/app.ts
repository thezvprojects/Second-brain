import { Component, OnInit } from '@angular/core';
import { ItemFormComponent } from './components/item-form/item-form';
import { ItemListComponent } from './components/item-list/item-list';
import { ItemService, Item } from './services/item';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ItemFormComponent, ItemListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  items: Item[] = [];
  loading = false;
  listError: string | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.listError = null;
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.listError = 'Could not load items.';
        this.loading = false;
      }
    });
  }

  onItemCreated(item: Item): void {
    this.items = [item, ...this.items];
  }
}
