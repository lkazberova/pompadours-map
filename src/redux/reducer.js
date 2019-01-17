import { combineReducers } from "redux";
import usersReducer, { moduleName as usersModule } from "../ducks/users";
import mapReducer, { moduleName as mapModule } from "../ducks/map";
import geocodeReducer, { moduleName as geocodeModule } from "../ducks/geocode";

export default combineReducers({
  [usersModule]: usersReducer,
  [mapModule]: mapReducer,
  [geocodeModule]: geocodeReducer
});
