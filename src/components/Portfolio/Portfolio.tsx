import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAsset,
  Asset,
  removeAsset,
  selectPortfolio,
} from "../../store/slices/portfolioSlice";
import { FixedSizeList as List } from "react-window";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import WebSocketService from "../../services/WebSocketService";
import { EMethod } from "../../services/types";
import { AppDispatch } from "../../store/store";
import CoinItem from "../CoinItem/CoinItem";
import AutoSizer from "react-virtualized-auto-sizer";
import styles from "./index.module.scss";
import FormAdd from "../FormAdd/FormAdd";
import Header from "../Header/Header";

export interface IFetchActive {
  symbol: string;
  price: number;
  change24h: number;
}

const Portfolio: React.FC = memo(() => {
  const [wsService, setWsService] = useState<WebSocketService>();
  const dispatch = useDispatch<AppDispatch>();
  const portfolio = useSelector(selectPortfolio);
  const [assets, setAssets] = useState<IFetchActive[]>([]);
  const [onOpen, setOnOpen] = useState(false);

  const getSaveParams = () => {
    console.log("Запрос", portfolio);

    if (wsService) {
      wsService.send({
        method: EMethod.SUBSCRIBE,
        id: "1",
        params: portfolio.map((item) => `${item.params.toLowerCase()}@ticker`),
      });
    }
  };
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr"
        );

        const usdtAssets = response.data
          .filter(
            (symbol: { symbol: string; lastPrice: number }) =>
              symbol.symbol.endsWith("USDT") && symbol.lastPrice != 0
          )
          .map(
            ({
              symbol,
              lastPrice,
              priceChangePercent,
            }: {
              symbol: string;
              lastPrice: number;
              priceChangePercent: number;
            }) => ({
              symbol,
              price: lastPrice,
              change24h: priceChangePercent,
            })
          );

        setAssets(usdtAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
    setWsService(new WebSocketService(dispatch));

    getSaveParams();
    return () => {
      wsService?.close();
    };
  }, []);

  const handleAdd = (params: string, quantity: string) => {
    if (!params || !quantity) return;
    dispatch(
      addAsset({
        id: uuidv4(),
        params,
        quantity: parseFloat(quantity),
        price: 0,
        change24h: 0,
      })
    );
    wsService?.subscribe(params);
  };

  const handleDel = (asset: Asset) => {
    dispatch(removeAsset(asset.id));
    wsService?.unsubscribe(asset.params);
  };

  const totalValue = portfolio.reduce(
    (sum, asset) => sum + asset.quantity * asset.price,
    0
  );

  return (
    <>
      {onOpen && (
        <FormAdd list={assets} handleAdd={handleAdd} trigger={setOnOpen} />
      )}
      <Header setOnOpen={setOnOpen} />
      <div className="portfolio">
        <div className={styles.table}>
          <div>Актив</div>
          <div>Колличество</div>
          <div>Цена</div>
          <div>Общая стоимость</div>
          <div>Изм. за 24 ч.</div>
          <div>% портфеля</div>
        </div>

        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              itemCount={portfolio.length}
              itemData={{
                items: portfolio,
                handleDel: handleDel,
                totalValue: totalValue,
              }}
              itemSize={60}
              width={width}
            >
              {CoinItem}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  );
});

export default Portfolio;
