export type CollectionType =
  | 'movies'
  | 'statues'
  | 'stamps'
  | 'comics'
  | 'books'
  | 'magazines';

export interface Collection {
  _id?: string;
  userId: string;
  type: CollectionType;
  name: string;
  subtitle?: string;
  color?: string;
  enabledFields?: string[];
  itemCount?: number;
  totalValue?: number;
  totalCost?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CollectionTypeOption {
  value: CollectionType;
  label: string;
  icon: string;
}

export const COLLECTION_TYPES: CollectionTypeOption[] = [
  { value: 'movies', label: 'Film e Serie TV', icon: 'movie' },
  { value: 'statues', label: 'Statue', icon: 'emoji_events' },
  { value: 'stamps', label: 'Francobolli', icon: 'mail' },
  { value: 'comics', label: 'Fumetti', icon: 'book' },
  { value: 'books', label: 'Libri', icon: 'menu_book' },
  { value: 'magazines', label: 'Periodici', icon: 'newspaper' },
];
