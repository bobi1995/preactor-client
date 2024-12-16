export interface IResource {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  color?: string;
  orders: IOrder[];
  regularShiftId: string;
  restrictions: IRestriction[];
  alternateShifts: IAlternativeShift[];
}

export interface IOrder {
  id: string;
  orderNumber: string;
  resourceId?: string;
  resource?: IResource;
}

export interface IShift {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
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
  day: string;
}
