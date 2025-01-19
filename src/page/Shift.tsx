import { useTranslation } from "react-i18next";
import ShiftTable from "../components/shift/Shift-table";

const Shift = () => {
  const { t } = useTranslation("resource");

  return (
    <div>
      <ShiftTable t={t} />
    </div>
  );
};

export default Shift;
