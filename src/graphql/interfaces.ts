export interface IResource {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  color?: string;
  orders: IOrder[];
  restrictions: IRestriction[];
  alternateShifts: IAlternativeShift[];
  externalCode?: string;
  schedule: ISchedule;
}
export interface IResourceLink {
  resource: IResource;
}

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  resourceLinks: IResourceLink[];
}

export interface IOrder {
  id: number;
  orderNumber?: string;
  operationNumber?: string;
  resource?: IResource;
  startTime?: string;
  endTime?: string;
  opName?: string;
}

export interface IShift {
  id: number;
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
  startTime: string;
  endTime: string;
  shifts: IShift[];
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

// Add these to your  interfaces
export interface IAttributeParameter {
  id: string;
  attributeValue: string;
  attributeNote?: string | null;
  attributeId: number;
}

export interface IAttribute {
  id: string;
  name: string;
  isParam: boolean;
  attributeParameters?: IAttributeParameter[];
}

export interface IChangeoverGroup {
  id: string;
  name: string;
  changeoverTimes?: IChangeoverTime[];
}

export interface IChangeoverTime {
  id: string;
  changeoverTime: number | null;
  attributeId: number;
  attribute: {
    id: string;
    name: string;
  };
}

export interface IChangeoverData {
  id: number;
  setupTime: number;
  changeoverGroupId: number;
  attributeId: number;
  fromAttrParamId: number;
  toAttrParamId: number;
  fromAttributeParameter?: {
    attributeValue: string;
  };
  toAttributeParameter?: {
    attributeValue: string;
  };
}

export interface IOrderRaw {
  id: number;
  orderNo: string;
  partNo: string;
  product: string;
  quantity: number;
  dueDate: string | null;
  opNo: string;
  operationName?: string | null;
  attributes: IOrderAttribute[];
}

export interface IOrderAttribute {
  id: number;
  orderId: number;
  value: string | null;
  attribute: {
    id: string;
    name: string;
    isParam: boolean;
  };
  attributeParam?: {
    id: string;
    attributeValue: string;
  };
}
