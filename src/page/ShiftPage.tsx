import { useParams } from "react-router";
import ErrorComponent from "../components/general/Error";
import { useShift } from "../graphql/hook/shift";
import InfinityLoader from "../components/general/Loader";
import TimelineComponent from "../components/general/gant/Timeline";
import ShiftInfo from "../components/shiftPage/ShiftInfo";
import BreaksTable from "../components/shiftPage/BreaksTable";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../graphql/interfaces";
import ResourcesTable from "../components/shiftPage/ResourcesTable";

const ShiftPage = () => {
  const { id } = useParams();
  const { t } = useTranslation("shift");

  if (!id) {
    return <ErrorComponent message="Shift not found" />;
  }
  const { shift, loading, error, reload } = useShift(id);
  if (loading) {
    return <InfinityLoader />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch shift. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }
  const { startHour, endHour, breaks } = shift;

  const [startHourValue, startMinuteValue] = startHour.split(":").map(Number);
  const [endHourValue, endMinuteValue] = endHour.split(":").map(Number);

  const startDecimal = startHourValue + startMinuteValue / 60;
  const endDecimal = endHourValue + endMinuteValue / 60;

  const leftPercentage = (startDecimal / 24) * 100;
  const widthPercentage = ((endDecimal - startDecimal) / 24) * 100;
  return (
    <div>
      <div className="px-3">
        <TimelineComponent viewType="hours" day={new Date()} />
        <div className="relative h-20 border border-black-300 grid ">
          <div className="bg-gray-300">
            <div
              className="absolute bg-green-300 h-full"
              style={{
                left: `${leftPercentage}%`,
                width: `${widthPercentage}%`,
              }}
            ></div>
            {/* Dynamically add breaks as gray intervals */}
            {breaks.map((breakItem: IBreaks) => {
              const [breakStartHour, breakStartMinute] = breakItem.startHour
                .split(":")
                .map(Number);
              const [breakEndHour, breakEndMinute] = breakItem.endHour
                .split(":")
                .map(Number);

              const breakStartDecimal = breakStartHour + breakStartMinute / 60;
              const breakEndDecimal = breakEndHour + breakEndMinute / 60;

              const breakLeftPercentage = (breakStartDecimal / 24) * 100;
              const breakWidthPercentage =
                ((breakEndDecimal - breakStartDecimal) / 24) * 100;

              return (
                <div
                  key={breakItem.id}
                  className="absolute bg-gray-300 h-full"
                  style={{
                    left: `${breakLeftPercentage}%`,
                    width: `${breakWidthPercentage}%`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between m-3 gap-10">
        <ShiftInfo {...shift} t={t} />
        <BreaksTable breaks={shift.breaks} t={t} />
        <ResourcesTable resources={shift.resources} t={t} />
      </div>
    </div>
  );
};

export default ShiftPage;
