import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService, Item, CreateItemRequest } from '../../services/item';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css'
})
export class ItemFormComponent {
  @Output() itemCreated = new EventEmitter<Item>();

  form: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private itemService: ItemService) {
    this.form = this.fb.group({
      itemType: ['note', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: [''],
      url: ['', Validators.pattern(/^(https?:\/\/.+)?$/)]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = null;

    const request: CreateItemRequest = {
      itemType: this.form.value.itemType,
      title: this.form.value.title,
      content: this.form.value.content || null,
      url: this.form.value.url || null
    };

    this.itemService.createItem(request).subscribe({
      next: (item) => {
        this.itemCreated.emit(item);
        this.form.reset({ itemType: 'note' });
        this.submitting = false;
      },
      error: () => {
        this.error = 'Failed to save item. Please try again.';
        this.submitting = false;
      }
    });
  }
}
