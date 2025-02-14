import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "@/services/service";
import { CreateAlert } from "./types";

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAll",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.apiCall("get", "/alert", {
        collectionId,
      });
      if (!response.data) {
        return rejectWithValue("No data received from server");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alerts",
      );
    }
  },
);

export const createAlert = createAsyncThunk(
  "alerts/create",
  async (
    { values, collectionId }: { values: CreateAlert; collectionId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await ApiService.apiCall(
        "post",
        "/alert",
        { ...values },
        null,
        {},
        true,
        { params: { collectionId } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create alert",
      );
    }
  },
);

export const generateAlertPreview = createAsyncThunk(
  "alerts/preview",
  async (
    { values, collectionId }: { values: CreateAlert; collectionId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await ApiService.apiCall(
        "post",
        "/alert/preview",
        { ...values },
        null,
        {},
        true,
        { params: { collectionId } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate alert preview",
      );
    }
  },
);

export const fetchAlertById = createAsyncThunk(
  "alerts/fetchById",
  async (alertId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.apiCall("get", `/alert/${alertId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alert",
      );
    }
  },
);

export const deleteAlert = createAsyncThunk(
  "alerts/delete",
  async (alertId: string, { rejectWithValue }) => {
    try {
      await ApiService.apiCall("delete", `/alert/${alertId}`);
      return alertId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete alert",
      );
    }
  },
);
