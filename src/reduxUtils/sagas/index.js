import { all } from "redux-saga/effects";
import "regenerator-runtime/runtime";

import { actionWatchersLogin, actionWatchersLogout } from "./auth";
import {
  actionWatchersCreateUser,
  actionWatchersGetUserInfo,
  actionWatchersGetUsers,
  actionWatchersDeleteUser,
  actionWatchersGetUser,
  actionWatchersUpdateUser
} from "./user";
import { 
  actionWatchersCreateRole,
  actionWatchersFetchRoles,
  actionWatchersUpdateRoles
} from "./roles";
import {
  actionWatchersCreateReceiving,
  actionWatchersCloseReceiving,
  actionWatchersEditReciept,
  actionWatchersDeleteReciept,
  actionWatchersGetReceivingList,
  actionWatchersPartNumExists,
  actionWatchersZone,
} from "./receiving";
import actionWatchersAddPartNumber from "./add_partnumber";
import {
  actionWatchersDeleteFile,
  actionWatchersUploadFile
} from "./fileUpload";
import {
  actionWatchersOrphanReceipts,
  actionWatchersResolveDiscrepancy
} from "./orphans";
import { actionWatchersStateReceiver } from "./receivingWorkflow";
import { actionWatchersGraphQlList } from "./graphql_list";
import { actionWatchersResolveMissingPartNum } from "./workflow/missingPartNum";
import { actionWatchersCurrentRoute } from "./currentRoute";
import {
  actionWatchersTaggedReceivings,
  actionWatchersScannedItemsUpdate,
  actionWatchersViewScannedItems,
  actionWatchersSerialNumberScannedPBox
} from "./workflow/taggedReceiving";
import {
  actionWatchersForgotPassword,
  actionWatchersResetPassword,
  actionWatchersChangePassword
} from "./password";
import {
  actionWatchersPrintLabel,
  actionWatchersPrintPartNumber,
  actionWatchersPrintTaggedReceiving,
  actionWatchersPrintTagReceipt
} from "./print/print";
import { actionWatchersHelpText } from "./generic";
import {
  actionWatchersFetchModules, actionWatchersSavePermissions,
  actionWatchersGetPermittedPages, actionWatchersFetchActions
} from "./permissions/permissionsSaga";
import { actionWatchersReceivingCount, actionWatchersReceivingInM2M } from "./workflow/receivingQueue";


export default function* rootSaga() {
  yield all([
    actionWatchersLogin(),
    actionWatchersCreateUser(),
    actionWatchersLogout(),
    actionWatchersCreateRole(),
    actionWatchersFetchRoles(),
    actionWatchersCreateReceiving(),
    actionWatchersAddPartNumber(),
    actionWatchersCloseReceiving(),
    actionWatchersEditReciept(),
    actionWatchersDeleteReciept(),
    actionWatchersGetUserInfo(),
    actionWatchersDeleteFile(),
    actionWatchersUploadFile(),
    actionWatchersGetReceivingList(),
    actionWatchersOrphanReceipts(),
    actionWatchersStateReceiver(),
    actionWatchersGraphQlList(),
    actionWatchersResolveDiscrepancy(),
    actionWatchersResolveMissingPartNum(),
    actionWatchersCurrentRoute(),
    actionWatchersTaggedReceivings(),
    actionWatchersScannedItemsUpdate(),
    actionWatchersViewScannedItems(),
    actionWatchersSerialNumberScannedPBox(),
    actionWatchersGetUsers(),
    actionWatchersDeleteUser(),
    actionWatchersHelpText(),
    actionWatchersGetUser(),
    actionWatchersUpdateUser(),
    actionWatchersForgotPassword(),
    actionWatchersResetPassword(),
    actionWatchersChangePassword(),
    actionWatchersPrintLabel(),
    actionWatchersPrintPartNumber(),
    actionWatchersPrintTaggedReceiving(),
    actionWatchersPrintTagReceipt(),
    actionWatchersPartNumExists(),
    actionWatchersFetchModules(),
    actionWatchersSavePermissions(),
    actionWatchersGetPermittedPages(),
    actionWatchersFetchActions(),
    actionWatchersUpdateRoles(),
    actionWatchersZone(),
    actionWatchersReceivingCount(),
    actionWatchersReceivingInM2M()
  ]);
}
