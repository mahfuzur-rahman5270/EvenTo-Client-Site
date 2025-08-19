import { RotatingLines } from "react-loader-spinner";

const ButtonLoader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <RotatingLines
        visible={true}
        height="26"
        width="26"
        color="grey"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default ButtonLoader;
