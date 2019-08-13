import React from 'react';
import { Query } from "react-apollo";
import { carriers } from "../../config/graphqlQuery";
import { ucfirst } from "../../utils/HelperFunctions";
const Carriers = () => (
  <Query query={carriers} >
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return null;
      if (!('carriers' in data)) return null;

      return data.carriers.map(({ carrierName, idCarrier, isTrackingNumberRequired }) => (
        <option
          value={idCarrier}
          key={idCarrier}
          data-validation={isTrackingNumberRequired}
        >
          {ucfirst(carrierName)}
        </option>
      ));
    }}
  </Query>
);


export default Carriers;