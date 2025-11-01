import React, { useState, useRef, useEffect } from "react";
import { IResource } from "../../../graphql/interfaces";
import { useResources } from "../../../graphql/hook/resource";
import { Check, ChevronDown } from "lucide-react";

interface ResourcesSelectProps {
  t: (key: string, options?: any) => string;
  selectedResources: string[];
  setSelectedResources: React.Dispatch<React.SetStateAction<string[]>>;
  assignedResources?: IResource[];
}

const ResourcesSelect: React.FC<ResourcesSelectProps> = ({
  t,
  selectedResources,
  setSelectedResources,
  assignedResources,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let { resources, loading: res_loading, error: res_error } = useResources();
  if (assignedResources && !res_loading) {
    resources = resources.filter(
      (resource: IResource) =>
        !assignedResources.map((r) => r.id).includes(resource.id)
    );
  }
  const handleResourceChange = (resourceId: string) => {
    if (resourceId === "ALL") {
      if (selectedResources.length === resources.length) {
        setSelectedResources([]);
      } else {
        setSelectedResources(
          resources.map((resource: IResource) => resource.id)
        );
      }
    } else {
      setSelectedResources((prev) =>
        prev.includes(resourceId)
          ? prev.filter((id) => id !== resourceId)
          : [...prev, resourceId]
      );
    }
  };

  const isResourceSelected = (resourceId: string) => {
    return selectedResources.includes(resourceId);
  };

  const getSelectedResourceNames = () => {
    return resources
      .filter((resource: IResource) => selectedResources.includes(resource.id))
      .map((resource: IResource) => resource.name)
      .join(", ");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="border border-gray-300 rounded p-2 w-full flex justify-between items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={res_loading || !!res_error}
      >
        <span>
          {res_loading
            ? t("no_resources")
            : res_error
            ? t("res_error")
            : selectedResources.length > 0
            ? getSelectedResourceNames()
            : t("select_resources")}
        </span>
        <ChevronDown className="w-5 h-5" />
      </button>
      {isDropdownOpen && !res_loading && !res_error && (
        <div className="absolute mt-1 w-full border border-gray-300 rounded bg-white z-10">
          <div
            className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
              selectedResources.length === resources.length ? "bg-blue-100" : ""
            }`}
            onClick={() => handleResourceChange("ALL")}
          >
            {selectedResources.length === resources.length && (
              <Check className="w-5 h-5 text-blue-600 mr-1" />
            )}
            <span className="font-bold">{t("select_all")}</span>
          </div>
          {resources.map((resource: IResource) => (
            <div
              key={resource.id}
              className={` flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                isResourceSelected(resource.id) ? "bg-blue-100" : ""
              }`}
              onClick={() => handleResourceChange(resource.id)}
            >
              {isResourceSelected(resource.id) && (
                <Check className="w-5 h-5  text-blue-600 mr-1" />
              )}
              <span>{resource.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesSelect;
