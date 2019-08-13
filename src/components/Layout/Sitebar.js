import React, { Component } from "react";
import { Link } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import { Collapse } from "reactstrap";
import "./Header";
import { connect } from "react-redux";

class Sitebar extends Component {
  constructor(props) {
    super(props);

    this.dashboard = this.dashboard.bind(this);
    this.elements = this.elements.bind(this);
    this.calendarmenu = this.calendarmenu.bind(this);
    this.form = this.form.bind(this);
    this.sidebarnav = this.sidebarnav.bind(this);
    this.table = this.table.bind(this);
    this.custompage = this.custompage.bind(this);
    this.authentication = this.authentication.bind(this);
    this.multilevel = this.multilevel.bind(this);
    this.auth = this.auth.bind(this);
    this.login = this.login.bind(this);
    this.invoice = this.invoice.bind(this);
    this.error = this.error.bind(this);

    this.state = {
      dashboard: false,
      elements: false,
      calendarmenu: false,
      form: false,
      sidebarnav: false,
      table: false,
      custompage: false,
      authentication: false,
      multilevel: false,
      auth: false,
      login: false,
      invoice: false,
      error: false,
      plussignele: false,
      plussignform: false,
      plussigndata: false,
      plussigncustome: false,
      plussignauthentic: false,
      plussignmulti: false,
      plussignauth: false,
      plussignlogin: false,
      plussigninvo: false,
      plussignerror: false
    };
  }

  dashboard() {
    this.setState({
      dashboard: !this.state.dashboard
    });
  }
  elements() {
    this.setState({
      elements: !this.state.elements,
      plussignele: !this.state.plussignele
    });
  }
  calendarmenu() {
    this.setState({
      calendarmenu: !this.state.calendarmenu
    });
  }
  sidebarnav() {
    this.setState({
      sidebarnav: !this.state.sidebarnav
    });
  }
  form() {
    this.setState({
      form: !this.state.form,
      plussignform: !this.state.plussignform
    });
  }
  table() {
    this.setState({
      table: !this.state.table,
      plussigndata: !this.state.plussigndata
    });
  }
  custompage() {
    this.setState({
      custompage: !this.state.custompage,
      plussigncustome: !this.state.plussigncustome
    });
  }
  authentication() {
    this.setState({
      authentication: !this.state.authentication,
      plussignauthentic: !this.state.plussignauthentic
    });
  }
  multilevel() {
    this.setState({
      multilevel: !this.state.multilevel,
      plussignmulti: !this.state.plussignmulti
    });
  }

  auth() {
    this.setState({
      auth: !this.state.auth,
      plussignauth: !this.state.plussignauth
    });
  }
  login() {
    this.setState({
      login: !this.state.login,
      plussignlogin: !this.state.plussignlogin
    });
  }
  invoice() {
    this.setState({
      invoice: !this.state.invoice,
      plussigninvo: !this.state.plussigninvo
    });
  }
  error() {
    this.setState({
      error: !this.state.error,
      plussignerror: !this.state.plussignerror
    });
  }

  isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      return false;
    } else {
      var prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    }
  }



  isPermittedPage = (url = "") => {
    let permittedPages = this.props.permittedPages;
    if( Array.isArray(permittedPages) && permittedPages.length > 0) {
      let isUserAuthorised = permittedPages.find(page => page.modulePageUrl === url);       
      return isUserAuthorised;
    } 
    return false;
  }

  render() {
    const navbar = this.props.leftNav;    
    const navBarItems = Object.keys(navbar).map((key, i) => {
      // if single record
      if (this.isPlainObject(navbar[key])) {
        return (
          <li className="active" key={i.toString()}>
            <Link to={navbar[key].url}>
              <i className={navbar[key].class} />
              <span className="right-nav-text">{key}</span>
            </Link>
          </li>
        );
      } // if nested menu items
      else if (Array.isArray(navbar[key])) {
        const innerList = navbar[key].map(value => {
          return (
            <li key={value.id.toString()}>
              <Link to={value.url}>
                <span className="right-nav-text">{value.name}</span>
              </Link>
            </li>
          );
        });
        return (
          <li key={i}>
            <a
              href="javascript:void(0);"
              onClick={this.elements}
              aria-expanded={this.state.plussignele ? "true" : "false"}
              className={this.state.plussignele ? "" : "collapsed"}
            >
              <div className="pull-left">
                <i className={navbar[key][0].class} />
                <span className="right-nav-text">{key}</span>
              </div>
              <div className="pull-right">
                <i className="ti-plus" />
              </div>
              <div className="clearfix" />
            </a>
            {
              <Collapse isOpen={this.state.elements}>
                <ul id="elements">{innerList}</ul>
              </Collapse>
            }
          </li>
        );
      }
    });

    return (
      <div className="side-menu-fixed">
        {/* TODO - Implementation of permitted pages rendering via loop. Its static right now*/}
        <ScrollArea
          speed={0.8}
          style={{ overflow: "hidden", marginLeft: -3 }}
          className="scrollbar side-menu-bg"
          contentClassName="saidbar"
          horizontal={false}
        >
          <div className="saidbar">
            <ul className="nav navbar-nav side-menu" id="sidebarnav">
              {/* {navBarItems} */}
              {/* <!-- Dashboard--> */}
              {/* <li>
                <Link to="dashboard">
                  <i className="ti-home" />
                  <span className="right-nav-text">Dashboard </span>
                </Link>
              </li> */}
              {/* <!-- Receiving --> */}
              {/* <li>
                <Link to="/receiving-at-dock-dashboard">
                  <i className="fa fa-handshake-o" />
                  <span className="right-nav-text">Receiving</span>
                </Link>
              </li> */}
              <li>
                <a
                  href="javascript:void(0);"
                  onClick={this.form}
                  aria-expanded={this.state.plussignform ? "true" : "false"}
                  className={this.state.plussignform ? "" : "collapsed"}
                >
                  <div className="pull-left">
                    <i className="fa fa-handshake-o" />
                    <span className="right-nav-text" id="receiving">Receiving</span>
                  </div>
                  <div className="pull-right">
                    <i className="ti-plus" />
                  </div>
                  <div className="clearfix" />
                </a>
                <Collapse isOpen={this.state.form}>
                  <ul id="Form">    
                  {this.isPermittedPage("receiving-at-dock-dashboard") &&             
                    <li>
                      <Link
                        to="/receiving-at-dock-dashboard" id="receiving-at-dock-dashboard"
                      >
                        Dashboard <span className="ml-10 badge badge-pill badge-success">{this.props.receivingCount.openReceiptCount}</span>
                      </Link>
                    </li>
                  }
                  {this.isPermittedPage("receiving-workflow") &&             
                    <li>
                      <Link to="receiving-workflow" id="receiving-workflow">
                        Workflow <span className="ml-10 badge badge-pill badge-danger">{this.props.receivingCount.closeReceiptCount}</span>
                      </Link>
                    </li>
                  }
                  </ul>
                </Collapse>
              </li>
              {/* <!-- Users --> */}

              {/* <!-- Permissions-->
              {/* <!-- Roles--> */}
               {(this.isPermittedPage("user-roles-list") ||  this.isPermittedPage("create-user") || this.isPermittedPage("create-permissions"))  && 
              <li>
                <a
                  href="javascript:void(0);"
                  onClick={this.table}
                  aria-expanded={this.state.plussigndata ? "true" : "false"}
                  className={this.state.plussigndata ? "" : "collapsed"}
                >
                  <div className="pull-left">
                    <i className="fa fa-users" />
                    <span className="right-nav-text" id="admin">Admin</span>
                  </div>
                  <div className="pull-right">
                    <i className="ti-plus" />
                  </div>
                  <div className="clearfix" />
                </a>
                <Collapse isOpen={this.state.table}>
                  <ul id="Form">
                  {this.isPermittedPage("user-roles-list") &&       
                    <li>
                      <Link to="user-roles-list" id="user-roles-list">
                        Roles
                      </Link>
                    </li>
                  }
                    {this.isPermittedPage("create-user") &&  
                    <li>
                      <Link to="create-user" id="create-user">Users</Link>
                    </li>
                    }                    
                    {this.isPermittedPage("create-permissions") &&  
                    <li>
                      <Link to="create-permissions" id="create-permissions">Permissions</Link>
                    </li>
                    }
                  </ul>
                </Collapse>
              </li>
               }
              {/* <li>
                <Link to="user-roles-list">
                  <i className="fa fa-users" />
                  <span className="right-nav-text">Roles</span>
                </Link>
              </li> */}
              <li>
                <a
                  href="javascript:void(0);"
                  onClick={this.custompage}
                  aria-expanded={this.state.plussigncustome ? "true" : "false"}
                  className={this.state.plussigncustome ? "" : "collapsed"}
                >
                  <div className="pull-left">
                    <i className="fa fa-cogs" />
                    <span className="right-nav-text" id="admin"> Client Settings  </span>
                  </div>
                  <div className="pull-right">
                    <i className="ti-plus" />
                  </div>
                  <div className="clearfix" />
                </a>
                <Collapse isOpen={this.state.custompage}>
                  <ul id="Form">
                  
                    <li>
                      <Link to="client-setup" id="user-roles-list">
                        Client Setup
                      </Link>
                    </li>
                    <li>
                      <Link to="client-setup" id="create-permissions">
                        Fulfliment Settings
                      </Link>
                    </li>
                    
                  </ul>
                </Collapse>
              </li>
              {/* <!-- Receiving Workflow--> */}
              {/* <li>
                <Link to="receiving-workflow">
                  <i className="fa fa-users" />
                  <span className="right-nav-text">Receiving Workflow</span>
                </Link>
              </li> */}
              {/* <li>
                <Link to="create-user">
                  <i className="fa fa-user-circle-o" />
                  <span className="right-nav-text">Manage Users</span>
                </Link>
              </li> */}
            </ul>
          </div>
        </ScrollArea>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    leftNav: state.user.leftNav,
    permittedPages: state.getPermittedPagesReducer.permittedPages,
    receivingCount: state.receiving_count
  };
};

export default connect(mapStateToProps)(Sitebar);
