import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { containers } from "../../config/graphqlQuery";
import { ucfirst } from "../../utils/HelperFunctions";

const Containers = (d) => (
    <Query query={containers}>
        {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return null;
            if (!('lookup' in data)) return null;

            return data.lookup.map(({ constantId, constantTypeId, constantValue }) => (
                <option value={constantId} key={constantId} selected={d.containerType == constantId ? "selected" : ""}>
                    {ucfirst(constantValue)}
                </option>
            ));
        }}
    </Query>
);
export default Containers;