export interface IResource {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  color?: string;
  orders: IOrder[];
  restrictions: IRestriction[];
  alternateShifts: IAlternativeShift[];
  schedule: ISchedule;
}
export interface IGroup {
  id: string;
  name: string;
  description?: string;
  resources: IResource[];
}

export interface IOrder {
  id: number;
  OrderNo?: string;
  OpNo?: number;
  resource?: IResource;
  StartTime: string;
  EndTime: string;
  OperationName?: string;
}

export interface IShift {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
  breaks: IBreaks[];
}
export interface ISchedule {
  id: string;
  name: string;
  monday: IShift;
  tuesday: IShift;
  wednesday: IShift;
  thursday: IShift;
  friday: IShift;
  saturday: IShift;
  sunday: IShift;
}

export interface IBreaks {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
}

export interface IRestriction {
  id: string;
  name: string;
  description?: string;
  resourceId?: string;
  resource?: IResource;
}

export interface IAlternativeShift {
  id: string;
  shiftId: string;
  shift: IShift;
  resourceId: string;
  resource: IResource;
  startDate: string;
  endDate: string;
  breaks: IBreaks[];
}
