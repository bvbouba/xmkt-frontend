import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import {reducer as formReducer } from 'redux-form'
import authReducer from './authSlices';
 import analyzeReducer from './analyzeSlices';
import participantReducer from './participantSlices';
import decideReducer from './decideSlices'
import storeReducer from './storeSlices'



  export const makeStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
      form: formReducer,
      participant: participantReducer,
      analyze:analyzeReducer,
      decide:decideReducer,
      store:storeReducer,
      }
    })
  }



export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
  
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']