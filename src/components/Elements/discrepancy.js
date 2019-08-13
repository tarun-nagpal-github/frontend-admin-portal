import React from 'react';
import {Query} from "react-apollo";
import { discrepancy } from "../../config/graphqlQuery";

const Discrepancy = () => (
    <Query query={discrepancy} >
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
export default Discrepancy;