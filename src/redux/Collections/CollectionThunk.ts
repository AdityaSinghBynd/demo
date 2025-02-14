import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "@/services/service";
import { Collection, CreateNewCollection } from "./types";

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.apiCall("get", "/collection", {
        ownerId,
      });
      if (!response.data) {
        return rejectWithValue("No data received from server");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch collections",
      );
    }
  },
);

export const createCollection = createAsyncThunk(
  "collections/create",
  async (values: CreateNewCollection, { rejectWithValue }) => {
    try {
      const response = await ApiService.apiCall("post", "/collection", values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create collection",
      );
    }
  },
);

export const updateCollection = createAsyncThunk(
  "collections/update",
  async (
    { id, body }: { id: string; body: Partial<CreateNewCollection> },
    { rejectWithValue },
  ) => {
    try {
      const response = await ApiService.apiCall(
        "put",
        `/collection/${id}`,
        body,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update collection",
      );
    }
  },
);

export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await ApiService.apiCall("delete", `/collection/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete collection",
      );
    }
  },
);

export const fetchCollectionById = createAsyncThunk(
  "collections/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.apiCall("get", `/collection/${id}`);
      console.log("response->", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch collection",
      );
    }
  },
);
