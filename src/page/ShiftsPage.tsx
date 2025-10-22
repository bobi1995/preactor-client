import ShiftTable from "../components/ShiftsPage/ShiftTable";
import LoadingDialog from "../components/general/LoadingDialog";
import { useShifts } from "../graphql/hook/shift";
import { useTranslation } from "react-i18next";
import { IShift } from "../graphql/interfaces";
import ErrorComponent from "../components/general/Error";
import { useLocation } from "react-router";
import CreateShiftDialogBtn from "../components/ShiftsPage/CreateShiftDialogBtn";
import SearchBar from "../components/general/SearchBar";
const Shift = () => {
  const { shifts, error, loading, reload } = useShifts();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const { t } = useTranslation();

  if (error || (!shifts && !loading)) {
    return (
      <div className="m-auto w-11/12 md:w-3/4 lg:w-2/3 p-4 sm:p-6 text-center">
        <ErrorComponent
          message={t("shiftPage.unableToFetchShift")}
          onRetry={reload}
        />
      </div>
    );
  }

  const filteredShifts =
    shifts?.filter((shift: IShift) =>
      shift.name.toLowerCase().includes(query)
    ) || [];
  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <LoadingDialog isLoading={loading} />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("shiftPage.title2")}
        </h1>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            {" "}
            {/* sm:w-80 is 320px. Use sm:w-96 for 384px if you want it even wider. */}
            <SearchBar placeholder={t("shiftTable.searchShiftByName")} />
          </div>

          <CreateShiftDialogBtn allShifts={shifts || []} />
        </div>
      </div>
      <ShiftTable
        shifts={filteredShifts}
        loading={loading}
        onRetry={reload}
        currentPage={currentPage}
        query={query}
      />
    </div>
  );
};

export default Shift;
