import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import { RolesQL } from "../../config/graphqlQuery";

const Roles = () => (
    <Query query={RolesQL}>
        {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return null;
            if (!('roles' in data)) return null;

            return data.roles.map(({ roleId, roleName }) => (
                <option value={roleId} key={roleId}>
                    {roleName}
                </option>
            ));
        }}
    </Query>
);
export default Roles;