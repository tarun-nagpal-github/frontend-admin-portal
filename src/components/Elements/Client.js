import React from 'react';
import { Query } from "react-apollo";
import { clients } from "../../config/graphqlQuery";
import { ucfirst } from "../../utils/HelperFunctions";

const Clients = (d) => (
  <Query query={clients()} >
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return null
      if (!('clientZones' in data)) return null;

      return data.clientZones.map(({ idClient, clientName, clientCode }) => (
        <option
          data-client-code={clientCode}
          value={idClient}
          key={clientCode}
          selected={d.param && d.param == idClient ? "selected" : ""}
        >
          {ucfirst(clientName)}
        </option>
      ));
    }}
  </Query>
);
export default Clients;