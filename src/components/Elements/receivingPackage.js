import React from 'react';
import {Query} from "react-apollo";
import { receiving_package_type } from "../../config/graphqlQuery";

const ReceivingPackage = (data) => {
    return (
        <Query query={receiving_package_type} >
            {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return null;
                if (!('lookup' in data)) return null;
    
                return data.lookup.map(({ constantExpression, constantId }) => (
                    <option value={constantId} key={constantId}>
                        {constantExpression}
                    </option>
                ));
            }}
        </Query>
    );
}
export default ReceivingPackage;