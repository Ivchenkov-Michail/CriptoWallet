export enum EMethod {
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE",
}

export interface ISocketSend {
  method: EMethod;
  id: string;
  params: string[];
}

export interface BinanceTickerData {
  e: string; // Тип события (например, "24hrTicker")
  E: number; // Время события (timestamp)
  s: string; // Символ (например, "BTCUSDT")
  P: string; // Изменение цены за 24 часа
  c: string; // Текущая цена
  h: string; // Максимальная цена за 24 часа
  l: string; // Минимальная цена за 24 часа
  v: string; // Объем торгов
  q: string; // Объем в долларах
}
