import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
  id: number;
  itemType: string;
  title: string;
  content: string | null;
  url: string | null;
  createdAt: string;
}

export interface CreateItemRequest {
  itemType: string;
  title: string;
  content?: string | null;
  url?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  createItem(request: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, request);
  }
}
