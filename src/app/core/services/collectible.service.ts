import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaccia Collectible con tipizzazione
export interface Collectible {
  _id?: string;
  collectionId: string;
  userId: string;
  type: string;

  // Campi comuni
  images?: string[];
  barcode?: string;
  condition?: string;
  purchasePrice?: number;
  estimatedValue?: number;
  personalNotes?: string;
  isFavorite?: boolean;

  // Campi specifici per tipo (possono esserci o no)
  title?: string;
  name?: string;
  director?: string;
  releaseYear?: number;
  duration?: number;
  issueNumber?: number;
  series?: string;
  publisher?: string;
  author?: string;
  character?: string;
  manufacturer?: string;
  scale?: string;
  height?: number;
  country?: string;
  issueYear?: number;
  faceValue?: number;
  isbn?: string;

  // Campi tecnici
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

@Injectable({ providedIn: 'root' })
export class CollectibleService {
  private http = inject(HttpClient);

  // BehaviorSubject per gestione stato reattivo
  private collectiblesSubject = new BehaviorSubject<Collectible[]>([]);
  public collectibles$ = this.collectiblesSubject.asObservable();

  // ========================================
  // GET - Lista Collectibles per Collezione
  // ========================================
  getCollectibles(collectionId: string): Observable<Collectible[]> {
    return this.http
      .get<Collectible[]>(
        `${environment.apiUrl}/collectibles/collection/${collectionId}`
      )
      .pipe(
        tap((collectibles) => {
          // Aggiorna il BehaviorSubject con i nuovi dati
          this.collectiblesSubject.next(collectibles);
        })
      );
  }

  // ========================================
  // GET - Singolo Collectible
  // ========================================
  getCollectibleById(id: string): Observable<Collectible> {
    return this.http.get<Collectible>(
      `${environment.apiUrl}/collectibles/${id}`
    );
  }

  // ========================================
  // POST - Crea Nuovo Collectible
  // ========================================
  createCollectible(
    collectionId: string,
    collectible: Partial<Collectible>
  ): Observable<Collectible> {
    return this.http
      .post<Collectible>(
        `${environment.apiUrl}/collectibles/collection/${collectionId}`,
        collectible
      )
      .pipe(
        tap((newCollectible) => {
          // Aggiungi il nuovo collectible alla lista locale
          const current = this.collectiblesSubject.value;
          this.collectiblesSubject.next([newCollectible, ...current]);
        })
      );
  }

  // ========================================
  // PUT - Aggiorna Collectible
  // ========================================
  updateCollectible(
    id: string,
    collectible: Partial<Collectible>
  ): Observable<Collectible> {
    return this.http
      .put<Collectible>(`${environment.apiUrl}/collectibles/${id}`, collectible)
      .pipe(
        tap((updated) => {
          // Aggiorna nella lista locale
          const current = this.collectiblesSubject.value;
          const index = current.findIndex((c) => c._id === id);
          if (index !== -1) {
            current[index] = updated;
            this.collectiblesSubject.next([...current]);
          }
        })
      );
  }

  // ========================================
  // DELETE - Elimina Collectible
  // ========================================
  deleteCollectible(id: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/collectibles/${id}`)
      .pipe(
        tap(() => {
          // Rimuovi dalla lista locale
          const current = this.collectiblesSubject.value;
          this.collectiblesSubject.next(current.filter((c) => c._id !== id));
        })
      );
  }

  // ========================================
  // PATCH - Toggle Favorito
  // ========================================
  toggleFavorite(id: string): Observable<Collectible> {
    return this.http
      .patch<Collectible>(
        `${environment.apiUrl}/collectibles/${id}/favorite`,
        {}
      )
      .pipe(
        tap((updated) => {
          // Aggiorna stato favorito nella lista locale
          const current = this.collectiblesSubject.value;
          const index = current.findIndex((c) => c._id === id);
          if (index !== -1) {
            current[index].isFavorite = updated.isFavorite;
            this.collectiblesSubject.next([...current]);
          }
        })
      );
  }

  // ========================================
  // GET - Tutti i Favoriti
  // ========================================
  getFavorites(): Observable<Collectible[]> {
    return this.http.get<Collectible[]>(
      `${environment.apiUrl}/collectibles/favorites`
    );
  }

  // ========================================
  // GET - Ricerca Collectibles
  // ========================================
  searchCollectibles(query: string): Observable<Collectible[]> {
    return this.http.get<Collectible[]>(
      `${environment.apiUrl}/collectibles/search?q=${query}`
    );
  }

  // ========================================
  // HELPER - Reset Cache Locale
  // ========================================
  clearCache(): void {
    this.collectiblesSubject.next([]);
  }
}
