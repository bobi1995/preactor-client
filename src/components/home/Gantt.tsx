import { useState } from "react";
import { IResource } from "../../graphql/interfaces";
import ResourceRow from "./ResourceRow";
import ViewPicker from "./ViePicker";

interface GantComponentProps {
  resources: IResource[];
  t: (key: string, options?: any) => string;
}

const GantComponent: React.FC<GantComponentProps> = ({ resources, t }) => {
  const [viewType, setViewType] = useState<"hours" | "days" | "weeks">("days");
  const [time, setTime] = useState(
    new Intl.DateTimeFormat("en-GB").format(new Date())
  );

  return (
    <div>
      <ViewPicker viewType={viewType} setViewType={setViewType} />

      <div className="flex justify-center bg-gray-100">
        {t("selected_time")}: {time}
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
