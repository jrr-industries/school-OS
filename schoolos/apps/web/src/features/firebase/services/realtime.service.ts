import { ref, get, set, update, push, query, orderByChild, equalTo, onValue, off, type Unsubscribe, type DataSnapshot, type DatabaseReference } from 'firebase/database';
import { getFirebaseDB } from '../config/client';

export class RealtimeService {
  private static db = getFirebaseDB();

  static schoolPath(schoolId: string, subPath?: string): string {
    return subPath ? `schools/${schoolId}/${subPath}` : `schools/${schoolId}`;
  }

  static async get<T>(path: string): Promise<T | null> {
    const snap = await get(ref(this.db, path));
    return snap.exists() ? (snap.val() as T) : null;
  }

  static async set<T>(path: string, data: T): Promise<void> {
    await set(ref(this.db, path), data);
  }

  static async update(path: string, data: Record<string, unknown>): Promise<void> {
    await update(ref(this.db, path), data);
  }

  static async push<T>(path: string, data: T): Promise<string> {
    const newRef = push(ref(this.db, path));
    await set(newRef, data);
    return newRef.key!;
  }

  static async query<T>(path: string, orderBy: string, value: string | number | boolean | null): Promise<T[]> {
    const q = query(ref(this.db, path), orderByChild(orderBy), equalTo(value));
    const snap = await get(q);
    if (!snap.exists()) return [];
    const results: T[] = [];
    snap.forEach((child: DataSnapshot) => {
      results.push(child.val() as T);
      return false;
    });
    return results;
  }

  static subscribe<T>(path: string, callback: (data: T | null) => void): Unsubscribe {
    const dbRef = ref(this.db, path);
    const handler = (snap: DataSnapshot) => {
      callback(snap.exists() ? (snap.val() as T) : null);
    };
    onValue(dbRef, handler);
    return () => off(dbRef, 'value', handler);
  }

  static subscribeList<T>(path: string, callback: (items: T[]) => void): Unsubscribe {
    const dbRef = ref(this.db, path);
    const handler = (snap: DataSnapshot) => {
      if (!snap.exists()) { callback([]); return; }
      const items: T[] = [];
      snap.forEach((child: DataSnapshot) => {
        const val = child.val();
        if (val) items.push({ ...val, id: child.key });
        return false;
      });
      callback(items);
    };
    onValue(dbRef, handler);
    return () => off(dbRef, 'value', handler);
  }

  static schoolRef(schoolId: string, ...paths: string[]): DatabaseReference {
    return ref(this.db, ['schools', schoolId, ...paths].join('/'));
  }
}
