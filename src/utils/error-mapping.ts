// src/utils/error-mapping.ts

export const ERROR_CODE_TO_TRANSLATION_KEY: { [key: string]: string } = {
  // --- Schedule Errors ---
  SCHEDULE_IN_USE: "schedulesPage.deleteErrorInUse",

  // --- Shift Errors ---
  SHIFT_IN_USE_BY_RESOURCE: "deleteShiftErrors.inUseByResource",
  SHIFT_IN_USE_BY_SCHEDULE: "deleteShiftErrors.inUseBySchedule",
  SHIFT_IN_USE_BY_ALTERNATIVE: "deleteShiftErrors.inUseByAlternative",
  SHIFT_NAME_TAKEN: "createShiftDialog.nameExistsError",
  // --- Generic Errors (can be used by any mutation) ---
  BAD_USER_INPUT: "errors.errorDuplicate",
  NOT_FOUND: "common.errorNotFound",
  INTERNAL_SERVER_ERROR: "common.errorGeneral",
  UNKNOWN_ERROR: "common.errorGeneral",
};
