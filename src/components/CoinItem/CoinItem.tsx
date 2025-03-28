import { memo } from "react";
import { Asset } from "../../store/slices/portfolioSlice";
import styles from "./index.module.scss";
interface IProps {
  data: {
    items: Asset[];
    handleDel: (asset: Asset) => void;
    totalValue: number;
  };
  //   handleDel: (asset: Asset) => void;
  index: number;
  style: React.CSSProperties;
}

const CoinItem = memo(({ index, style, data }: IProps) => {
  const item = data.items[index];
  const assetValue = item.quantity * item.price;
  const percentage = data.totalValue
    ? ((assetValue / data.totalValue) * 100).toFixed(2)
    : "0";
  return (
    <div style={style} className={styles.coin}>
      <div onClick={() => data.handleDel(item)}>
        <div>{item.params.slice(0, -4)}</div>
        <div>{item.quantity}</div>
        <div>{item.price.toFixed(2)}$</div>
        <div>{(item.price * item.quantity).toFixed(2)}$</div>
        <div
          style={{
            color:
              item.change24h < 0 ? "rgba(255, 20, 30, 1)" : "rgba(67,173,40,1)",
          }}
        >
          {item.change24h}%
        </div>
        <div>{percentage}%</div>
      </div>
    </div>
  );
});

export default CoinItem;
// onClick={() => handleDel(asset)}
