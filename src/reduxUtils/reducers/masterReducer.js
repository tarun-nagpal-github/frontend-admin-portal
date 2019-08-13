import { combineReducers } from "redux";

import authReducer from "./authReducer";
import createUserReducer from "./createUserReducer";
import createRolesReducer from "./createRolesReducer";
import createReceivingReducer from "./createReceivingReducer";
import addPartNumberReducer from "./addPartNumberReducer";
import editReceivingReducer from "./editReceivingReducer";
import closeReceivingReducer from "./closeReceivingReducer";
import deleteRecieptReducer from "./deleteRecieptReducer";
import userReducer from "./userReducer";
import deleteFileReducer from "./deleteFileReducer";
import uploadFilereducer from "./uploadFilereducer";
import getReceivingListReducer from "./getReceivingListReducer";
import orphanReceiptsReducer from "./orphanReceiptsReducer";
import receivingStateReducer from "./receivingStateReducer";
import missingPartNumReducer from "./workflow/missingPartNumReducer";
import graphqlQuery from "./graphqlReducer";
import currentRouteReducer from "./currentRouteReducer";
import serialItemsReducer from "./workflow/serialItemsReducer";
import viewScannedItems from "./workflow/viewScannedItems";
import scannedItemPerBox from "./workflow/scannedItemPerBox";
import getUsersListReducer from "./getUsersListReducer";
import deleteUserReducer from "./deleteUserReducer";
import genericReducer from "./genericReducer";
import editUserReducer from "./editUserReducer";
import updateUserReducer from "./updateUserReducer";
import passwordReducer from "./passwordReducer";
import labelReducer from "./print/labelReducer";
import partNumberReducer from "./print/partNumberReducer";
import taggedReceivingReducer from "./print/taggedReceivingReducer";
import tagReceiptReducer from "./print/tagReceiptReducer";
import checkPartReducer from "./m2m/checkPartReducer";
import getRolesReducer from "./roles/getRolesReducer";
import fetchRolesReducer from "./roles/fetchRolesReducer";
import permissionsReducer from "./permissions/permissionsReducer";
import savePermissionsReducer from "./permissions/savePermissionsReducer";
import getPermittedPagesReducer from "./permissions/getPermittedPagesReducer";
import fetchActionsReducer from "./permissions/fetchActionsReducer";
import updateRolesReducer from "./roles/updateRolesReducer";
import storeZoneReducer from "./storeZoneReducer";
import receivingCountReducer from "./workflow/receivingCountReducer";
import receivingQueueReducer from "./workflow/receivingQueueReducer";

const masterReducer = combineReducers({
  user: authReducer,
  create_user: createUserReducer,
  roles: createRolesReducer,
  create_receiving: createReceivingReducer,
  close_receiving: closeReceivingReducer,
  add_partnumber: addPartNumberReducer,
  edit_receiving: editReceivingReducer,
  delete_file: deleteFileReducer,
  upload_file: uploadFilereducer,
  user_meta: userReducer,
  delete_reciept: deleteRecieptReducer,
  receiving_list: getReceivingListReducer,
  orphan_receipts: orphanReceiptsReducer,
  receiving_state: receivingStateReducer,
  graphql_list: graphqlQuery,
  missing_part_num: missingPartNumReducer,
  current_route: currentRouteReducer,
  serial_items: serialItemsReducer,
  view_scanned_items_response: viewScannedItems,
  box_scanning_per_box: scannedItemPerBox,
  get_users: getUsersListReducer,
  delete_users: deleteUserReducer,
  reducer_state: genericReducer,
  edit_user: editUserReducer,
  update_user: updateUserReducer,
  password_reducer: passwordReducer,
  label_reducer: labelReducer,
  part_number_reducer: partNumberReducer,
  tagged_receiving_reducer: taggedReceivingReducer,
  tag_receipt_reducer: tagReceiptReducer,
  checkPartReducer,
  getRolesReducer,
  fetchRolesReducer,
  permissionsReducer,
  savePermissionsReducer,
  getPermittedPagesReducer,
  fetchActionsReducer,
  updateRolesReducer,
  storeZoneReducer,
  receiving_count: receivingCountReducer,
  receiving_queue_m2m: receivingQueueReducer
});

export default (state, action) => (
  action.type === 'LOGOUT_SUCCESS'
      ? masterReducer(undefined, action)
      : masterReducer(state, action)
)

// export default masterReducer;
