import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../Redux/Reducer";

export const store = createStore( //el store mantiene el árbol de estado de la aplicación
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
