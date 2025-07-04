import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listProducts = createAsyncThunk(
  "product/listProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/products", {}, config); // Empty object for default product
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/products/${id}`, config);
      return id; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
    successCreate: false,
    successDelete: false,
    createdProduct: null,
  },
  reducers: {
    resetProductCreate: (state) => {
      state.successCreate = false;
      state.createdProduct = null;
    },
    resetProductDelete: (state) => {
      state.successDelete = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.successCreate = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successCreate = true;
        state.createdProduct = action.payload;
        state.products.push(action.payload); // Add new product to existing list
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.successDelete = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successDelete = true;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductCreate, resetProductDelete } = productSlice.actions;
export default productSlice.reducer;
