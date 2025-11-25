import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.travel_loader}></div>
    </div>
  );
};

export default Loader;
