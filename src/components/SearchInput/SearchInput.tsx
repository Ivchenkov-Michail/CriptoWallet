import React from "react";
import styles from "./index.module.scss";
interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({ value, setValue }: IProps) => {
  return (
    <div className={styles.search}>
      <input
        type="search"
        name="serch"
        id="search"
        placeholder="Поиск валюта"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
