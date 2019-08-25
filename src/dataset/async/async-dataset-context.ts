import { DatasetContext, AsyncDrainType } from "../sync";

export interface AsyncDatasetContext<T, TCreate extends T = T, TFind extends (TCreate | T) = (TCreate | T)> extends DatasetContext<true, T, TCreate, TFind, AsyncDrainType<any>> {

}
