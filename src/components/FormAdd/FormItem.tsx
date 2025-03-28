import { IFetchActive } from "../Portfolio/Portfolio";
import styles from "./index.module.scss";

interface IProps {
  item: IFetchActive;
  setCurrentItem: React.Dispatch<
    React.SetStateAction<IFetchActive | undefined>
  >;
}

const FormItem = ({ item, setCurrentItem }: IProps) => {
  return (
    <div className={styles.item} onClick={() => setCurrentItem(item)}>
      <div>{item.symbol.slice(0, -4)}</div>
      <div>{item.price}</div>
      <div
        style={{
          color:
            item.change24h < 0 ? "rgba(255, 20, 30, 1)" : "rgba(67,173,40,1)",
        }}
      >
        {item.change24h}
      </div>
    </div>
  );
};

export default FormItem;
