import { useState } from "react";
import { IResource } from "../../graphql/interfaces";
import ResourceRow from "./ResourceRow";
import ViewPicker from "./ViewPicker";
import moment from "moment";
import { ArrowBigRightDashIcon, ArrowBigLeftDashIcon } from "lucide-react";

interface GantComponentProps {
  resources: IResource[];
  t: (key: string, options?: any) => string;
}

const GantComponent: React.FC<GantComponentProps> = ({ resources, t }) => {
  const [viewType, setViewType] = useState<
    "hours" | "days" | "weeks" | "half-1" | "half-2"
  >("days");
  const [time, setTime] = useState(
    new Intl.DateTimeFormat("en-GB").format(new Date())
  );

  const nextPeriod = () => {
    if (viewType === "half-1") {
      const newTime = moment(time, "DD/MM/YYYY HH:mm")
        .add(12, "hours")
        .format("DD/MM/YYYY HH:mm");
      setTime(newTime);
      setViewType("half-2");
    } else if (viewType === "half-2") {
      const newTime = moment(time, "DD/MM/YYYY HH:mm")
        .add(12, "hours")
        .format("DD/MM/YYYY HH:mm");
      setTime(newTime);
      setViewType("half-1");
    } else if (viewType === "hours") {
      const newTime = moment(time, "DD/MM/YYYY")
        .add(1, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    } else if (viewType === "days") {
      const newTime = moment(time, "DD/MM/YYYY")
        .add(7, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    } else {
      const newTime = moment(time, "DD/MM/YYYY")
        .add(28, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    }
  };

  const previousPeriod = () => {
    if (viewType === "half-1") {
      const newTime = moment(time, "DD/MM/YYYY HH:mm")
        .subtract(12, "hours")
        .format("DD/MM/YYYY HH:mm");
      setTime(newTime);
      setViewType("half-2");
    } else if (viewType === "half-2") {
      const newTime = moment(time, "DD/MM/YYYY HH:mm")
        .subtract(12, "hours")
        .format("DD/MM/YYYY HH:mm");
      setTime(newTime);
      setViewType("half-1");
    } else if (viewType === "hours") {
      const newTime = moment(time, "DD/MM/YYYY")
        .subtract(1, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    } else if (viewType === "days") {
      const newTime = moment(time, "DD/MM/YYYY")
        .subtract(7, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    } else {
      const newTime = moment(time, "DD/MM/YYYY")
        .subtract(28, "days")
        .format("DD/MM/YYYY");
      setTime(newTime);
    }
  };

  return (
    <div>
      <ViewPicker
        viewType={viewType}
        setViewType={setViewType}
        setTime={setTime}
        t={t}
      />

      <div className="flex justify-center bg-gray-100 gap-10 pb-4">
        <p className="text-lg">
          {viewType === "hours" ? t("selected_time") : t("start_date")}:{" "}
          <strong>{time}</strong>
        </p>
        <div className="flex gap-4">
          <ArrowBigLeftDashIcon
            className="h-6 w-6 cursor-pointer"
            onClick={previousPeriod}
          />
          <ArrowBigRightDashIcon
            className="h-6 w-6 cursor-pointer"
            onClick={nextPeriod}
          />
        </div>
      </div>
      <ResourceRow
        resources={resources}
        viewType={viewType}
        setTime={setTime}
        setViewType={setViewType}
        time={time}
      />
    </div>
  );
};

export default GantComponent;
