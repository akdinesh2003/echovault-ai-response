import 'server-only';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import type { IncidentReport } from './types';

export async function getIncidents(): Promise<IncidentReport[]> {
  const incidentsCol = collection(db, 'incidents');
  const q = query(incidentsCol, orderBy('timestamp', 'desc'));
  const incidentSnapshot = await getDocs(q);
  const incidentsList = incidentSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate().getTime(),
    } as IncidentReport
  });
  return incidentsList;
}

export async function addIncident(incident: Omit<IncidentReport, 'id' | 'timestamp' | 'mediaUrl'> & { mediaDataUri?: string | null }): Promise<IncidentReport> {
  let downloadURL: string | undefined = undefined;

  if (incident.mediaDataUri) {
    const { mediaDataUri, ...incidentData } = incident;
    const storageRef = ref(storage, `incidents/${crypto.randomUUID()}`);
    const uploadResult = await uploadString(storageRef, mediaDataUri, 'data_url');
    downloadURL = await getDownloadURL(uploadResult.ref);
    
    const docRef = await addDoc(collection(db, 'incidents'), {
        ...incidentData,
        mediaUrl: downloadURL,
        timestamp: serverTimestamp(),
    });

    return {
        id: docRef.id,
        ...incident,
        mediaUrl: downloadURL,
        timestamp: Date.now(),
    };

  } else {
    const { mediaDataUri, ...incidentData } = incident;
    const docRef = await addDoc(collection(db, 'incidents'), {
      ...incidentData,
      timestamp: serverTimestamp(),
    });
  
    return {
      id: docRef.id,
      ...incident,
      timestamp: Date.now(),
    };
  }
}

export async function getIncidentById(id: string): Promise<IncidentReport | undefined> {
    const incidents = await getIncidents();
    return incidents.find(incident => incident.id === id);
}
