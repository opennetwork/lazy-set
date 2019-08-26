import { DatasetContext, AsyncDrainType } from "../sync";

export interface AsyncDatasetContext<T, TCreate = T, TFind = TCreate | T> extends DatasetContext<true, T, TCreate, TFind, AsyncDrainType<any>> {

}
