import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

import { environment } from './environments/environment';
import { Band } from './app/band.model';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  private app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  getBands(): Observable<Band[]> {
    return new Observable<Band[]>((subscriber) => {
      const bandsRef = collection(this.db, 'bands');

      const unsubscribe = onSnapshot(
        bandsRef,
        (snapshot) => {
          const bands = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<Band, 'id'>),
            }))
            .sort((a, b) => b.date.localeCompare(a.date));

          subscriber.next(bands);
        },
        (error) => {
          subscriber.error(error);
        },
      );

      return () => unsubscribe();
    });
  }

  addBand(band: Omit<Band, 'id'>) {
    return addDoc(collection(this.db, 'bands'), band);
  }

  updateRecord(band: Band) {
    if (!band.id) {
      throw new Error('Band id is required for update');
    }

    const { id, ...data } = band;

    return updateDoc(doc(this.db, 'bands', String(id)), data);
  }

  deleteRecord(id: string | number) {
    return deleteDoc(doc(this.db, 'bands', String(id)));
  }
}
