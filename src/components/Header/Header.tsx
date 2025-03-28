import React from "react";
import styles from "./index.module.scss";
import Button from "../../ui/Button/Button";

interface IProps {
  setOnOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ setOnOpen }: IProps) => {
  return (
    <div className="container">
      <div className={styles.header}>
        <h2>Cripto Portfolio</h2>
        <Button handleClick={() => setOnOpen(true)} title="Добавить" />
      </div>
    </div>
  );
};

export default Header;
