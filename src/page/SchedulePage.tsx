import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import ErrorComponent from "../components/general/Error";
import { useSchedule } from "../graphql/hook/schedule";
import InfinityLoader from "../components/general/Loader";
import StaticTimeline from "../components/general/gant/StaticTimeline";
import WeekSchedule from "../components/schedulePage/Week-schedule";
import DaysTable from "../components/schedulePage/Days-table";

const SchedulePage = () => {
  const { id } = useParams();
  const { t } = useTranslation("resource");
  if (!id) {
    return <ErrorComponent message="Schedule not found" />;
  }
  const { schedule, loading, error, reload } = useSchedule(id);
  if (loading) {
    return <InfinityLoader />;
  }

  if (!schedule || error) {
    return (
      <ErrorComponent message="Schedule not found" onRetry={() => reload()} />
    );
  }
  return (
    <div className="px-3">
      <StaticTimeline viewType="days" day={new Date()} />
      <WeekSchedule schedule={schedule} />
      <DaysTable schedule={schedule} t={t} />
    </div>
  );
};

export default SchedulePage;
