import { useState } from "react";
import { IResource } from "../../graphql/interfaces";
import ResourceRow from "./ResourceRow";
import ViewPicker from "./ViePicker";

interface GantComponentProps {
  resources: IResource[];
}

const GantComponent: React.FC<GantComponentProps> = ({ resources }) => {
  const [viewType, setViewType] = useState<"hours" | "days" | "weeks">("days");
  return (
    <div>
      <ViewPicker viewType={viewType} setViewType={setViewType} />

      <ResourceRow resources={resources} viewType={viewType} />
    </div>
  );
};

export default GantComponent;
