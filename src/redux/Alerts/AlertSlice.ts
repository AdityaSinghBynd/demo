import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAlerts,
  createAlert,
  generateAlertPreview,
  fetchAlertById,
  deleteAlert,
} from "./AlertThunk";
import { Alert, CreateAlert } from "./types";

interface AlertState {
  items: Alert[];
  selectedAlert: Alert | null;
  previewData: any | null;
  loading: {
    fetch: boolean;
    create: boolean;
    preview: boolean;
    delete: boolean;
  };
  error: {
    fetch: string | null;
    create: string | null;
    preview: string | null;
    delete: string | null;
  };
}

const initialState: AlertState = {
  items: [],
  selectedAlert: null,
  previewData: null,
  loading: {
    fetch: false,
    create: false,
    preview: false,
    delete: false,
  },
  error: {
    fetch: null,
    create: null,
    preview: null,
    delete: null,
  },
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSelectedAlert: (state) => {
      state.selectedAlert = null;
    },
    clearPreviewData: (state) => {
      state.previewData = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(
        fetchAlerts.fulfilled,
        (state, action: PayloadAction<Alert[]>) => {
          state.loading.fetch = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message || "Failed to fetch alerts";
      });

    // Create Alert
    builder
      .addCase(createAlert.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createAlert.fulfilled, (state, action: PayloadAction<Alert>) => {
        state.loading.create = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message || "Failed to create alert";
      });

    // Generate Preview
    builder
      .addCase(generateAlertPreview.pending, (state) => {
        state.loading.preview = true;
        state.error.preview = null;
      })
      .addCase(generateAlertPreview.fulfilled, (state, action) => {
        state.loading.preview = false;
        state.previewData = action.payload;
      })
      .addCase(generateAlertPreview.rejected, (state, action) => {
        state.loading.preview = false;
        state.error.preview =
          action.error.message || "Failed to generate preview";
      });

    // Fetch Single Alert
    builder
      .addCase(fetchAlertById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedAlert = action.payload;
      })
      .addCase(fetchAlertById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message || "Failed to fetch alert";
      });

    // Delete Alert
    builder
      .addCase(deleteAlert.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(
        deleteAlert.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading.delete = false;
          state.items = state.items.filter(
            (item) => item.id !== action.payload,
          );
        },
      )
      .addCase(deleteAlert.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message || "Failed to delete alert";
      });
  },
});

export const { clearErrors, clearSelectedAlert, clearPreviewData } =
  alertSlice.actions;
export default alertSlice.reducer;
