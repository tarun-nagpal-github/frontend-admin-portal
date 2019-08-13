import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import { storage_units } from "../../config/graphqlQuery";

const StorageUnits = () => (
    <Query query={storage_units}>
        {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return null;
            if (!('lookup' in data)) return null;

            return data.lookup.map(({ constantValue, constantId }) => (
                <option value={constantId} key={constantId}>
                    {constantValue}
                </option>
            ));
        }}
    </Query>
);
export default StorageUnits;