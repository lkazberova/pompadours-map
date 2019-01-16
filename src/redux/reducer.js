import { combineReducers } from "redux";
import usersReducer, { moduleName as usersModule } from "../ducks/users";
import mapReducer, { moduleName as mapModule } from "../ducks/map";

export default combineReducers({
  [usersModule]: usersReducer,
  [mapModule]: mapReducer
});
