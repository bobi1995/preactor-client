import React from "react";
import { IResource } from "../../graphql/interfaces";
import { endpoint } from "../../../dbconfig";
import Schedule from "./ResourceRow/Schedule";
import TimelineComponent from "../general/gant/Timeline";
import { Link } from "react-router";

interface ResourceRowProps {
  resources: IResource[];
  viewType: "hours" | "days" | "weeks";
  setViewType: (viewType: "hours" | "days" | "weeks") => void;
  setTime: (time: string) => void;
  time: string;
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resources,
  viewType,
  setTime,
  time,
  setViewType,
}) => {
  return (
    <div className="w-full bg-gray-300 ">
      <div className="flex">
        <div className="w-40 bg-gray-300"></div>
        <div className="w-full ">
          <TimelineComponent
            viewType={viewType}
            day={new Date()}
            setTime={setTime}
            setViewType={setViewType}
          />
        </div>
      </div>
      {resources.map((res) => (
        <div className="flex" key={res.id}>
          <div className=" bg-gray-100 sticky z-10 w-40 h-30">
            <div className="h-20 flex items-center justify-center border border-gray-300 p-2">
              <img
                src={`${endpoint}/static/${res.picture}`}
                alt={res.name}
                className="w-12 h-12 rounded-full border border-gray-300 shadow-md"
              />
              <Link
                className="ml-3 text-gray-800 font-semibold text-sm md:text-base tracking-wide"
                to={`/resource/${res.id}`}
              >
                {res.name}
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Schedule resource={res} viewType={viewType} time={time} />
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
};

export default ResourceRow;
