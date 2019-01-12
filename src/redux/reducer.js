import { combineReducers } from "redux";
import usersReducer, { moduleName as usersModule } from "../ducks/users";

export default combineReducers({
  [usersModule]: usersReducer
});
