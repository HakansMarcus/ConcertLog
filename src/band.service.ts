import { Injectable, signal } from '@angular/core';
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
  getDoc,
  arrayUnion,
  getDocs,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

import { environment } from './environments/environment';
import { Band } from './app/band.model';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  private app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private storage = getStorage(this.app);
  private auth = getAuth(this.app);

  currentUser = signal<User | null>(null);
  authReady = signal(false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.authReady.set(true);
    });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }

  private getUserBandsPath() {
    const uid = this.currentUser()?.uid;

    if (!uid) {
      throw new Error('User must be logged in');
    }

    return `users/${uid}/bands`;
  }

  getBands(): Observable<Band[]> {
    return new Observable<Band[]>((subscriber) => {
      const user = this.currentUser();

      if (!user) {
        subscriber.next([]);
        return;
      }

      const bandsRef = collection(this.db, this.getUserBandsPath());

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
        (error) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  addBand(band: Omit<Band, 'id'>) {
    return addDoc(collection(this.db, this.getUserBandsPath()), band);
  }

  updateRecord(band: Band) {
    if (!band.id) throw new Error('Band id is required for update');

    const { id, ...data } = band;

    return updateDoc(doc(this.db, this.getUserBandsPath(), String(id)), data);
  }

  deleteRecord(id: string | number) {
    return deleteDoc(doc(this.db, this.getUserBandsPath(), String(id)));
  }

  async getBandById(id: string | number): Promise<Band | undefined> {
    const bandDoc = await getDoc(doc(this.db, this.getUserBandsPath(), String(id)));

    if (!bandDoc.exists()) return undefined;

    return {
      id: bandDoc.id,
      ...(bandDoc.data() as Omit<Band, 'id'>),
    };
  }

  async uploadBandPhotos(bandId: string | number, files: File[]) {
    const uid = this.currentUser()?.uid;

    if (!uid) throw new Error('User must be logged in');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const safeFileName = file.name.replace(/\s+/g, '-').toLowerCase();
      const filePath = `users/${uid}/bands/${bandId}/${Date.now()}-${safeFileName}`;
      const fileRef = ref(this.storage, filePath);

      await uploadBytes(fileRef, file);

      const url = await getDownloadURL(fileRef);
      uploadedUrls.push(url);
    }

    await updateDoc(doc(this.db, this.getUserBandsPath(), String(bandId)), {
      photoUrls: arrayUnion(...uploadedUrls),
    });

    return uploadedUrls;
  }
}
