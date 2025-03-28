import { memo } from "react";
import styles from "./index.module.scss";

interface IProps {
  title: string;
  handleClick: () => void;
  style?: React.CSSProperties;
}

const Button = memo(({ title, handleClick, style }: IProps) => {
  return (
    <button
      className={styles.button}
      onClick={() => handleClick()}
      style={style}
    >
      {title}
    </button>
  );
});

export default Button;
