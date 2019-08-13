import React from 'react';
import {Query} from "react-apollo";
import { pools } from "../../config/graphqlQuery";

const Pools = (d) => {
    return (
        <Query query={pools(d.clientId, d.zoneId)} >
            {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return null;
                if (!('pools' in data)) return null;

                return data.pools.map(({ idPool, poolCode, poolDescription }) => (
                    <option value={idPool} key={idPool}>
                        {poolDescription}
                    </option>
                ));
            }}
        </Query>
    );
}
export default Pools;