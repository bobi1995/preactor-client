import React from "react";
import { useShifts } from "../graphql/hook/shift";
import InfinityLoader from "../components/general/Loader";
import ErrorComponent from "../components/general/Error";
import ShiftTable from "../components/shift/Shift-table";

const Shift = () => {
  const { shifts, error, loading, reload } = useShifts();

  if (loading) {
    return <InfinityLoader />;
  }
  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch resources. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }

  return (
    <div>
      <ShiftTable shift={shifts} />
    </div>
  );
};

export default Shift;
