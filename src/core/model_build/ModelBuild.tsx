import * as React from "react";
import {Component} from "react";
import {Checkbox} from "@material-ui/core";

type ModelBuildProps = {
    columns: []
}

export class ModelBuild extends Component<ModelBuildProps, {}> {

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, [name]: event.target.checked});
    };

    render() {
        return (
            <div><Checkbox checked={true} onChange={this.handleChange('checkedA')}
                value="checkedA" inputProps={{'aria-label': 'primary checkbox',}}/></div>
        );
    }
}