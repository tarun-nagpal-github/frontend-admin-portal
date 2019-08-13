import copy from 'copy-to-clipboard';
import React from "react";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Moment from "moment";
import { Alert } from "reactstrap";
import fetch from 'unfetch';

export function formatDate(date = null) {
  return Moment(date)
    .local()
    .format("MM/DD/YYYY");
}

export function checkIsArray(value = null) {
  return (value instanceof Array) ? value : [];
}

export function ucfirst(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function copyToClipboard(text) {
  return copy(text);
}

export function getButtonIfRecords(value = null) {
  return (value > 0) ? (<button className="btn btn-styling btn-sm">View ({value})</button>) : null;
}

export function apolloClientGraphQL(graphQLendpoint) {
  return new ApolloClient({
    fetchOptions: { fetch },
    link: new HttpLink({ uri: graphQLendpoint, fetch: fetch }),
    cache: new InMemoryCache()
  });
}

export function errorList(errors) {
  var items = [];
  errors.forEach((err, i) => {
    items.push(<li className="ml-2" key={i}>{err}</li>);
  });
  return (
    <div>
      <Alert color="danger">
        {items}
      </Alert>
    </div>
  );
}

export function errorMessage(error) {
  return (
    <div>
      <div className="text-danger">
        {error}
      </div>
    </div>
  );
}

export function regularExpCodeForPassword() {
  return /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/i;
}

export function printDocumentPopUp(data, documentName, style) {
  var windowObject = window.open('', documentName, style);
  windowObject.document.write(data);
  windowObject.document.close();
  windowObject.focus();
  setTimeout(() =>{
    windowObject.print();
    windowObject.close();
    return true;
  }, 2000);
  // return window.open(data,documentName,style);
}

export function getValueFromCustomAttribute(e, attribute = null) {
  let selectedOption = e.target.value;
  const selectedIndex = e.target.options.selectedIndex;
  return e.target.options[selectedIndex].getAttribute(attribute);
}


export function isActionAllowed(actions, actionName = "") {
  let allowed = false;
  if (Array.isArray(actions) && actions > 0) {
    allowed = actions.find((element) => element == actionName);
  }
  return allowed;
}