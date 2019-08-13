import React from "react";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

class ShowMultiselectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      selectedColumn: props.selectedColumns
    }
  }

  handleSelectedItem = (event) => {
    this.setState({
      selectedColumn: event.target.value
    }, () => this.props.onUpdateState(this.state.selectedColumn));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns
    });
  }

  renderSelectHTML = () => {
    return (
      <div>
        <FormControl
          style={{
            marginBottom: "10px",
            minWidth: 120,
            maxWidth: 300
          }}
        >
          <Select
            multiple
            value={this.state.selectedColumn}
              input={<Input id="select-mul " />}
            renderValue={() => "Columns"}
            autoWidth
            variant="filled"
            disableUnderline
            style={{
              borderWidth: 1,
              borderColor: "#d8d8d8",
              borderStyle: "solid",
              padding: 2,
              paddingLeft: 5,
              fontSize: 12,
              width: 100
            }}
            onChange={this.handleSelectedItem}
          >
            {this.state.columns.map(column => {
              if(column.id != "checkbox"){
                return(
                  <MenuItem key={column.id} value={column.id}>
                    <Checkbox
                      checked={this.state.selectedColumn.indexOf(column.id) > -1}
                      style={{ width: 45 }}
                      color="primary"
                    />
                    <span style={{ fontSize: 12 }}>{column.Header}</span>
                  </MenuItem>
                )
              }
            })}
          </Select>
        </FormControl>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderSelectHTML()}
      </div>
    )
  }
}

export default ShowMultiselectComponent;