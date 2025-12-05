import { client } from '../../appwrite';
import { Databases, Storage, ID, Query } from 'appwrite';
import type { Presentation } from '../types';

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

class PresentationService {
  async uploadImage(file: File): Promise<string> {
    try {
      const response = await storage.createFile(
        {
          bucketId: BUCKET_ID,
          fileId: ID.unique(),
          file: file
        }
      );
      
      const fileUrl = storage.getFileView(
        {
          bucketId: BUCKET_ID, 
          fileId: response.$id
        }
      );
      return fileUrl.toString();
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  async savePresentation(presentation: Presentation, userId: string): Promise<void> {
    try {
      const existing = await databases.listDocuments(
        {
          databaseId: DATABASE_ID,
          collectionId: COLLECTION_ID,
          queries: [Query.equal('userId', userId)]
        }
      );

      const data = {
        userId,
        presentationData: JSON.stringify(presentation)
      };

      if (existing.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          existing.documents[0].$id,
          data
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          data
        );
      }
    } catch (error) {
      console.error('Save presentation error:', error);
      throw error;
    }
  }

  async loadPresentation(userId: string): Promise<Presentation | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const doc = response.documents[0];
      return JSON.parse(doc.presentationData as string);
    } catch (error) {
      console.error('Load presentation error:', error);
      return null;
    }
  }
}

export const presentationService = new PresentationService();