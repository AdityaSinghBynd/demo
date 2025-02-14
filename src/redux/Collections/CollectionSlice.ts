import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  fetchCollectionById,
} from "./CollectionThunk";
import { Collection, CollectionState } from "./types";

const initialState: CollectionState = {
  items: [],
  selectedCollection: null,
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    fetch: null,
    create: null,
    update: null,
    delete: null,
  },
};

const normalizeCollection = (data: any): Collection => {
  if (data.collection) {
    return data.collection;
  }
  return data;
};

const collectionSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSelectedCollection: (state) => {
      state.selectedCollection = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Collections
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(
        fetchCollections.fulfilled,
        (state, action: PayloadAction<Collection[]>) => {
          state.loading.fetch = false;
          state.items = action.payload.map(normalizeCollection);
        },
      )
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch =
          action.error.message || "Failed to fetch collections";
      });

    // Create Collection
    builder
      .addCase(createCollection.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(
        createCollection.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading.create = false;
          const normalizedCollection = normalizeCollection(action.payload);
          state.items = [...state.items, normalizedCollection];
        },
      )
      .addCase(createCollection.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create =
          action.error.message || "Failed to create collection";
      });

    // Update Collection
    builder
      .addCase(updateCollection.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(
        updateCollection.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading.update = false;
          const normalizedCollection = normalizeCollection(action.payload);
          state.items = state.items.map((item) =>
            item.id === normalizedCollection.id ? normalizedCollection : item
          );
        },
      )
      .addCase(updateCollection.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update =
          action.error.message || "Failed to update collection";
      });

    // Delete Collection
    builder
      .addCase(deleteCollection.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(
        deleteCollection.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading.delete = false;
          state.items = state.items.filter(
            (item) => item.id !== action.payload,
          );
        },
      )
      .addCase(deleteCollection.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete =
          action.error.message || "Failed to delete collection";
      });

    // Fetch Single Collection
    builder
      .addCase(fetchCollectionById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedCollection = normalizeCollection(action.payload);
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch =
          action.error.message || "Failed to fetch collection";
      });
  },
});

export const { clearErrors, clearSelectedCollection } = collectionSlice.actions;
export default collectionSlice.reducer;