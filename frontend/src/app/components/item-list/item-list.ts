import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../services/item';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css'
})
export class ItemListComponent {
  @Input() items: Item[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
}
