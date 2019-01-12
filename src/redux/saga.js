import { all } from "redux-saga/effects";
import { saga as usersSaga } from "../ducks/users";

export default function*() {
  yield all([usersSaga()]);
}
