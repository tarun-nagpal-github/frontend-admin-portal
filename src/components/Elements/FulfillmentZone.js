import React from 'react';
import {Query} from "react-apollo";
import { FulfillmentZoneQuery } from "../../config/graphqlQuery";

const FulfillmentZone = (d) => {
    return (
        <Query query={FulfillmentZoneQuery()} >
            {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return null;
                if (!('fulfillmentZone' in data)) return null;
    
                return data.fulfillmentZone.map(({ facilityId, idFulfillmentZone }) => (
                    <option
                        value={idFulfillmentZone}
                        key={idFulfillmentZone}
                        selected={d.param && d.param == idFulfillmentZone ? "selected" : ""}
                    >
                        {facilityId}
                    </option>
                ));
            }}
        </Query>
    );
}
export default FulfillmentZone;