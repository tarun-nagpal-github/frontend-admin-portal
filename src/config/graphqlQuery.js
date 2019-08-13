/*
 * GraphQL Queires
 */
import gql from "graphql-tag";

export const FulfillmentZoneQuery = (param) => {
  if (param) {
    return (
      gql`{
        fulfillmentZone(id:${param}){
          facilityId
          idFulfillmentZone
          zoneName
        }
      }`
    );
  } else {
    return (
      gql`{
        fulfillmentZone{
          facilityId
          idFulfillmentZone
          zoneName
        }
      }`
    );
  }
};

export const RolesQL = gql`
  {
    roles {
      roleId
      roleName
    }
}`;

export const ToolTip = (expression) => `query {
        lookup(key:"`+ expression + `"){
        constantExpression
        constantValue
    }
}`;

export const getRolesArray = gql`
  query UserTypeQuery {
    roles {
      roleId
      roleName
    }
  }
`;

export const carriers = gql`
  query {carriers{
      carrierName
      idCarrier
      isTrackingNumberRequired
    }
  }`;

export const discrepancy = gql`
  query {lookup(key:"receiving_discrepancy_status"){
    constantExpression
    constantId
  }
}`;

export const clients = () => {
  return (
    gql`query {clientZones{
      clientName
      idClient
      clientCode
    }}`
  );
};

export const pools = (clientId, zoneId) => {
  return (
    gql`query {pools(clientId:${clientId}, zoneId:${zoneId}){
      idPool
      poolCode
      poolDescription
    }}`
  )
}

export const receiving_package_type = gql`query {
    lookup(key:"receiving_package_type"){
        constantExpression
        constantId
    }
}`;

export const storage_units = gql`query {
  lookup(key:"storage_units"){
    constantValue
    constantId
  }
}`;

export const containers = gql`query {
  lookup(key:"container_type"){
    constantExpression
    constantId
    constantTypeId
    constantValue
  }
}`;

export const discrepancyQuery = `query {lookup(key:"receiving_discrepancy_status"){constantExpression constantId}}`;

export const receivingCounts = (param) => {
  return (
    `query {
        receiptWorkflowNotifications(zoneid:${param}){
          openReceiptCount
          closeReceiptCount
          orphanReceiptCount
          missingPartReceiptCount
          receivingQueueCount
          tagReceiptCount
          readyToMoveCount
          totalNotificationCount
        }
      }`
  );
};