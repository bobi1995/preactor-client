import { useState } from "react";
import { useTranslation } from "react-i18next";
const Home = () => {
  const [count, setCount] = useState(0);
  const { t, i18n } = useTranslation("home");

  return (
    <>
      <h1>{t("home")}</h1>
    </>
  );
};

export default Home;
