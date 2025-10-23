import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Collection } from '../models/collection.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient);
  private collectionsSubject = new BehaviorSubject<Collection[]>([]);
  public collections$ = this.collectionsSubject.asObservable();

  getCollections(): Observable<Collection[]> {
    return this.http
      .get<Collection[]>(`${environment.apiUrl}/collections`)
      .pipe(tap((collections) => this.collectionsSubject.next(collections)));
  }

  getCollectionById(id: string): Observable<Collection> {
    return this.http.get<Collection>(`${environment.apiUrl}/collections/${id}`);
  }

  createCollection(collection: Partial<Collection>): Observable<Collection> {
    return this.http
      .post<Collection>(`${environment.apiUrl}/collections`, collection)
      .pipe(
        tap((newCollection) => {
          const current = this.collectionsSubject.value;
          this.collectionsSubject.next([...current, newCollection]);
        })
      );
  }

  updateCollection(
    id: string,
    collection: Partial<Collection>
  ): Observable<Collection> {
    return this.http
      .put<Collection>(`${environment.apiUrl}/collections/${id}`, collection)
      .pipe(
        tap((updated) => {
          const current = this.collectionsSubject.value;
          const index = current.findIndex((c) => c._id === id);
          if (index !== -1) {
            current[index] = updated;
            this.collectionsSubject.next([...current]);
          }
        })
      );
  }

  deleteCollection(id: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/collections/${id}`)
      .pipe(
        tap(() => {
          const current = this.collectionsSubject.value;
          this.collectionsSubject.next(current.filter((c) => c._id !== id));
        })
      );
  }
}
