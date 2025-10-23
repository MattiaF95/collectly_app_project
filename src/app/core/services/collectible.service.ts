import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollectibleService {
  private http = inject(HttpClient);

  getCollectibles(collectionId: string): Observable<any[]> {
    // return this.http.get<any[]>(`${environment.apiUrl}/collectibles/collection/${collectionId}`);

    // MOCK per ora
    return of([]);
  }

  getCollectibleById(collectionId: string, id: string): Observable<any> {
    // return this.http.get<any>(`${environment.apiUrl}/collectibles/collection/${collectionId}/${id}`);
    return of({});
  }

  createCollectible(collectionId: string, collectible: any): Observable<any> {
    // return this.http.post<any>(`${environment.apiUrl}/collectibles/collection/${collectionId}`, collectible);

    // MOCK per ora
    return of({
      _id: Date.now().toString(),
      ...collectible,
      collectionId,
      createdAt: new Date(),
    });
  }

  updateCollectible(
    collectionId: string,
    id: string,
    collectible: any
  ): Observable<any> {
    // return this.http.put<any>(`${environment.apiUrl}/collectibles/collection/${collectionId}/${id}`, collectible);
    return of(collectible);
  }

  deleteCollectible(collectionId: string, id: string): Observable<void> {
    // return this.http.delete<void>(`${environment.apiUrl}/collectibles/collection/${collectionId}/${id}`);
    return of(void 0);
  }
}
