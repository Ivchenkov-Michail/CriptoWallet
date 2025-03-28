import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { BinanceTickerData } from "../../services/types";

export interface Asset {
  id: string;
  params: string;
  quantity: number;
  price: number;
  change24h: number;
}

interface PortfolioState {
  assets: Asset[];
}

const initialState: PortfolioState = {
  assets: JSON.parse(localStorage.getItem("portfolio") || "[]"),
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      const item = state.assets.find(
        (item) => item.params == action.payload.params
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.assets.push(action.payload);
        localStorage.setItem("portfolio", JSON.stringify(state.assets));
      }
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload
      );
      localStorage.setItem("portfolio", JSON.stringify(state.assets));
    },
    updatePrice: (
      state,
      action: PayloadAction<{
        params: string;
        price: number;
        change24h: number;
      }>
    ) => {
      const asset = state.assets.find(
        (a) => a.params === action.payload.params
      );
      if (asset) {
        asset.price = action.payload.price;
        asset.change24h = action.payload.change24h;
      }
    },
    socketStream: (state, action: PayloadAction<BinanceTickerData>) => {
      const asset = state.assets.find(
        (item) => item.params == action.payload.s
      );

      // console.log(asset);
      if (asset) {
        asset.price = Number(action.payload.c);
        asset.change24h = Number(action.payload.P);
      }
    },
  },
});

export const { addAsset, removeAsset, updatePrice, socketStream } =
  portfolioSlice.actions;
export const selectPortfolio = (state: RootState) => state.portfolio.assets;
export default portfolioSlice.reducer;
