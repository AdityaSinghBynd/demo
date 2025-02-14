export interface Collection {
  id: string;
  collectionName: string;
  collectionDescription: string;
  email: string;
  createdAt: string;
  schedule: string;
  alerts?: Array<any>;
  ownerId: string;
  updatedAt: string;
  deletedAt: string;
}

export interface CreateNewCollection {
  collectionName: string;
  collectionDescription: string;
  email: string;
  schedule: "Daily" | "Weekly" | "Monthly";
  ownerId: string;
}

export interface CollectionState {
  items: Collection[];
  selectedCollection: Collection | null;
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: {
    fetch: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
}
