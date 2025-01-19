import { useTranslation } from "react-i18next";
import SchedulesTable from "../components/schedule/Schedules-table";

const Schedule = () => {
  const { t } = useTranslation("resource");

  return (
    <div>
      <SchedulesTable t={t} />
    </div>
  );
};

export default Schedule;
