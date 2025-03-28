import { ChangeEvent, useEffect, useState } from "react";
import { IFetchActive } from "../Portfolio/Portfolio";
import FormItem from "./FormItem";
import styles from "./index.module.scss";
import Button from "../../ui/Button/Button";
import SearchInput from "../SearchInput/SearchInput";
interface IProps {
  list: IFetchActive[];
  handleAdd: (params: string, quantity: string) => void;
  trigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormAdd = ({ list, handleAdd, trigger }: IProps) => {
  const [currentActive, setCurrentActive] = useState<IFetchActive>();
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState("");
  const [filteredList, setFilteredList] = useState<IFetchActive[]>();
  useEffect(() => {
    if (value)
      setFilteredList(() =>
        list.filter((item) => item.symbol.includes(value.toUpperCase()))
      );
    else setFilteredList(list);
  }, [value, list]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      (Number(e.target.value) <= 300 && quantity > 0) ||
      (!quantity && Number(e.target.value) > 0)
    )
      setQuantity(Number(e.target.value));
  };
  const handleSubmit = () => {
    if (currentActive) handleAdd(currentActive?.symbol, String(quantity));
    setCurrentActive({ symbol: "", price: 0, change24h: 0 });
    trigger(false);
  };
  return (
    <>
      <div className={styles.background} onClick={() => trigger(false)}></div>
      <div className={styles.window}>
        <h2>Добавить валюту</h2>
        <SearchInput value={value} setValue={setValue} />
        <div className={styles.list}>
          <div>
            {filteredList?.map((item) => (
              <FormItem
                item={item}
                setCurrentItem={setCurrentActive}
                key={item.symbol}
              />
            ))}
          </div>
        </div>
        {currentActive?.symbol && (
          <div className={styles.quantityStep}>
            <div>
              <div>{currentActive.symbol.slice(0, -4)}</div>
              <div>{currentActive.price}$</div>
            </div>
            <div>
              <input
                type="number"
                name="number"
                id="number"
                value={quantity}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <Button title={"Добавить"} handleClick={() => handleSubmit()} />
            <Button
              style={{
                backgroundColor: "rgb(203, 203, 203)",
                marginLeft: "10px",
              }}
              title={"Oтмена"}
              handleClick={() => trigger(false)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FormAdd;
