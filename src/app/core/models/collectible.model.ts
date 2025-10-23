export interface BaseCollectible {
  _id?: string;
  collectionId: string;
  userId: string;
  type: string;
  images?: string[];
  estimatedValue?: number;
  purchasePrice?: number;
  addedDate?: Date;
  personalNotes?: string;
  isFavorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MovieCollectible extends BaseCollectible {
  title: string;
  itemType: 'movie' | 'series';
  releaseYear?: number;
  genres?: string[];
  director?: string;
  actors?: string[];
  format?: string[];
  audioLanguages?: string[];
  subtitles?: string[];
  duration?: number;
  seasons?: number;
  episodes?: number;
  barcode?: string;
  specialEdition?: string[];
  status?: 'to_watch' | 'watching' | 'completed';
}

export interface StatueCollectible extends BaseCollectible {
  name: string;
  character?: string;
  series?: string;
  manufacturer?: string;
  category?: string;
  limitedEdition?: {
    number?: number;
    total?: number;
  };
  barcode?: string;
  dimensions?: {
    scale?: string;
    height?: number;
    width?: number;
    depth?: number;
  };
  releaseYear?: Date;
  materials?: string[];
  condition?: 'mint' | 'near_mint' | 'good' | 'fair' | 'poor';
  packaging?: 'with_original_box' | 'without_original_box';
  purchaseLocation?: string;
  status?: 'new' | 'used' | 'damaged' | 'missing_parts';
}

export interface StampCollectible extends BaseCollectible {
  name: string;
  country?: string;
  issueYear?: number;
  faceValue?: number;
  currency?: string;
  series?: string;
  catalogNumber?: string;
  colors?: string[];
  theme?: string[];
  condition?: 'mint' | 'used' | 'no_gum';
  perforation?: string;
  format?: string;
  printType?: string;
  paper?: string;
  watermark?: string;
  gum?: string[];
  cancellation?: string;
  specialConditions?: string[];
  certificate?: {
    authority?: string;
    date?: Date;
  };
  provenance?: string;
}

export interface ComicCollectible extends BaseCollectible {
  title: string;
  issueNumber?: number;
  series?: string;
  publisher?: string;
  publicationYear?: number;
  language?: string;
  authors?: string[];
  genres?: string[];
  condition?: string;
  barcode?: string;
  format?: 'stapled' | 'hardcover' | 'paperback' | 'omnibus' | 'tankobon';
  pageCount?: number;
  coverImage?: string;
  readingStatus?: 'read' | 'to_read' | 'reading';
}

export interface BookCollectible extends BaseCollectible {
  title: string;
  author?: string;
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  language?: string;
  genres?: string[];
  pageCount?: number;
  format?: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  edition?: string;
  condition?: string;
  readingStatus?: 'read' | 'to_read' | 'reading';
}

export interface MagazineCollectible extends BaseCollectible {
  title: string;
  issueNumber?: number;
  series?: string;
  publisher?: string;
  publicationDate?: Date;
  language?: string;
  theme?: string;
  pageCount?: number;
  condition?: string;
  barcode?: string;
}
