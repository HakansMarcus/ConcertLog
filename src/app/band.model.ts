export interface Band {
  id?: string | number;
  status: 'planned' | 'attended';

  name: string;
  city: string;
  date: string;
  venue: string;
  festival?: string;
  photoUrls?: string[];
}
